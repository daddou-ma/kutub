import { writeFileSync } from "fs";
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
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { connectionFromRepository } from "Relay/Connection.factory";
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

@Resolver(() => EPub)
export default class EPubResolver {
  @InjectRepository(EPub, "prod")
  private readonly repository!: Repository<EPub>;

  @FieldResolver(() => User, { nullable: true })
  async createdBy(@Root() epub: EPub): Promise<User> {
    return await this.repository
      .createQueryBuilder()
      .relation(EPub, "createdBy")
      .of(epub)
      .loadOne();
  }

  @FieldResolver(() => Book)
  async book(@Root() epub: EPub): Promise<Book> {
    return await this.repository
      .createQueryBuilder()
      .relation(EPub, "book")
      .of(epub)
      .loadOne();
  }

  @Query(() => EPubConnection)
  async epubs(@Args() args: ConnectionArguments): Promise<EPubConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Query(() => EPub)
  async epubById(@Arg("epubId") epubId: string): Promise<EPub> {
    try {
      return await this.repository.findOneOrFail(epubId);
    } catch (error) {
      throw new UserInputError("No EPub Found with this id");
    }
  }

  @Mutation(() => EPub)
  async uploadEPub(
    @Arg("data") { upload }: CreateEPubInput,
    @Ctx() { user }: Context
  ): Promise<EPub> {
    const { filename, createReadStream } = await upload;
    const uuid = uuidv4();
    const filePath = `content/uploads/epubs/${uuid}.epub`;
    const coverPath = `content/uploads/covers/${uuid}.png`;

    await saveFile(createReadStream(), path.resolve(filePath));

    const { base, coverImage } = await getEPubMetadata(path.resolve(filePath));

    writeFileSync(path.resolve(coverPath), await coverImage);

    const authors = await Promise.all(
      base.creators.map(async ({ name }) => {
        return await Author.findOrCreate({ name });
      })
    );

    const publisher = await Publisher.findOrCreate({ name: base.publisher });

    const book = await Book.findOrCreate({
      isbn: base.identifiers[0].value as string,
      title: base.titles[0],
      description: base.description,
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

  @Mutation(() => EPub)
  async updateEPub(
    @Arg("epubId") epubId: string,
    @Arg("data") input: UpdateEPubInput
  ): Promise<EPub> {
    await this.repository.update(epubId, input);
    return this.repository.findOne(epubId);
  }

  @Mutation(() => EPub)
  async deleteEPub(@Arg("epubId") epubId: string): Promise<EPub> {
    try {
      const epub = await this.repository.findOneOrFail(epubId);
      await this.repository.remove(epub);
      return epub;
    } catch (error) {
      throw new UserInputError("No EPub Found with this id");
    }
  }
}
