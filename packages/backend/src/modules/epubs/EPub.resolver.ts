import { v4 as uuidv4 } from "uuid";
import path from "path";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Args,
  FieldResolver,
  Root,
  Ctx,
  Authorized,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { connectionFromRelation, connectionFromRepository } from "Relay/Connection.factory";
import { CreateEPubInput, UpdateEPubInput } from "Modules/epubs/EPub.inputs";
import { UserInputError } from "apollo-server";

import EPub from "Modules/epubs/EPub.entity";
import Book from "Modules/books/Book.entity";
import User from "Modules/users/User.entity";
import Author from "Modules/authors/Author.entity";
import Publisher from "Modules/publishers/Publisher.entity";
import { EPubConnection } from "Modules/epubs/EPub.connection";
import { getEPubMetadata } from "Utils/epub";
import { saveFile } from "Utils/file";
import Context from "Interfaces/Context";

import sharp from "sharp";

@Resolver(() => EPub)
export default class EPubResolver {
  @InjectRepository(EPub, "prod")
  private readonly repository!: Repository<EPub>;

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => User, { nullable: true })
  async createdBy(@Root() epub: EPub): Promise<User> {
    return await this.repository
      .createQueryBuilder()
      .relation(EPub, "createdBy")
      .of(epub)
      .loadOne();
  }

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => Book)
  async book(@Root() epub: EPub): Promise<Book> {
    return await this.repository
      .createQueryBuilder()
      .relation(EPub, "book")
      .of(epub)
      .loadOne();
  }

  @Authorized("ADMIN")
  @Query(() => EPubConnection)
  async epubs(@Args() args: ConnectionArguments): Promise<EPubConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized(["ADMIN", "USER"])
  @Query(() => EPubConnection)
  async library(@Args() args: ConnectionArguments, @Ctx() { db, user }: Context): Promise<EPubConnection> {
    return connectionFromRelation(args, db, User, "epubs", user);
  }

  @Authorized(["ADMIN", "USER"])
  @Query(() => EPub)
  async epubById(@Arg("epubId") epubId: string, @Ctx() { user }: Context): Promise<EPub> {
    try {
      const epub = await this.repository.findOneOrFail(epubId, { relations: ["createdBy"]});

      if (epub.createdBy.id !== user.id) {
        throw new UserInputError("No Permissions");
      }

      return await epub;
    } catch (error) {
      throw new UserInputError("No EPub Found with this id");
    }
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => EPub)
  async uploadEPub(
    @Arg("data") { upload }: CreateEPubInput,
    @Ctx() { user }: Context
  ): Promise<EPub> {
    const { filename, createReadStream } = await upload;
    const uuid = uuidv4();
    const filePath = `content/uploads/epubs/${uuid}.epub`;
    const coverPath = `content/uploads/covers/${uuid}.thumb.webp`;

    await saveFile(createReadStream(), path.resolve(filePath));

    const { base, coverImage } = await getEPubMetadata(path.resolve(filePath));

    const cover = sharp(await coverImage);
    cover.resize({ width: 128 }).webp().toFile(path.resolve(coverPath));

    const authors = await Promise.all(
      base.creators.map(async ({ name }) => {
        return await Author.findOrCreate({ name });
      })
    );

    let publisher = null;
    if (base.publisher) {
      publisher = await Publisher.findOrCreate({ name: base.publisher });
    }

    const book = await Book.findOrCreate({
      isbn: base.identifiers[0].value as string,
      title: base.titles[0],
      description: (base?.description || '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, ''),
      publisher,
      coverPath,
      authors,
    });

    const epub = await this.repository.create({
      filename,
      filePath,
      book,
      createdBy: user,
    });

    await this.repository.save(epub);
    return epub;
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => EPub)
  async updateEPub(
    @Arg("epubId") epubId: string,
    @Arg("data") input: UpdateEPubInput,
    @Ctx() { user } : Context,
  ): Promise<EPub> {
    const epub = await this.repository.findOneOrFail(epubId, { relations: ["createdBy"]});
    
    if (epub.createdBy.id !== user.id) {
      throw new UserInputError("No Permissions");
    }

    return await this.repository.save(this.repository.merge(epub, input));
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => EPub)
  async deleteEPub(@Arg("epubId") epubId: string, @Ctx() { user } : Context): Promise<EPub> {
    try {
      const epub = await this.repository.findOneOrFail(epubId, { relations: ["createdBy"]});
    
      if (epub.createdBy.id !== user.id) {
        throw new UserInputError("No Permissions");
      }

      await this.repository.remove(epub);
      return epub;
    } catch (error) {
      throw new UserInputError("No EPub Found with this id");
    }
  }
}
