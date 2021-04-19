import { createWriteStream, writeFileSync } from "fs";
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
import { CreateEPubInput, UpdateEPubInput } from "Modules/epubs/inputs";
import { UserInputError } from "apollo-server";

import EPub from "Modules/epubs/EPub.entity";
import Book from "Modules/books/Book.entity";
import User from "Modules/users/User.entity";
import { EPubConnection } from "Modules/epubs/EPub.connection";

import { getEPubMetadata } from "Utils/epub";
import { saveFile } from "Utils/file";
import Context from "Interfaces/Context";
import Author from "Modules/authors/Author.entity";

@Resolver((of) => EPub)
export default class EPubResolver {
  @InjectRepository(EPub, "prod")
  private readonly repository!: Repository<EPub>;

  @FieldResolver()
  async owner(@Root() epub: EPub): Promise<User> {
    return await this.repository
      .createQueryBuilder()
      .relation(EPub, "owner")
      .of(epub)
      .loadOne();
  }

  @FieldResolver()
  async book(@Root() epub: EPub): Promise<Book> {
    return await this.repository
      .createQueryBuilder()
      .relation(EPub, "book")
      .of(epub)
      .loadOne();
  }

  @Query((returns) => EPubConnection)
  async epubs(@Args() args: ConnectionArguments): Promise<EPubConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Query((returns) => EPub)
  async epubById(@Arg("epubId") epubId: string): Promise<EPub> {
    try {
      return await this.repository.findOneOrFail(epubId);
    } catch (error) {
      throw new UserInputError("No EPub Found with this id");
    }
  }

  @Mutation((returns) => EPub)
  async uploadEPub(
    @Arg("data") { upload }: CreateEPubInput,
    @Ctx() { db }: Context
  ): Promise<EPub> {
    const { filename, createReadStream } = await upload;

    const filePath = `content/uploads/epubs/${filename}`;
    const coverPath = `content/uploads/covers/${filename}.png`;

    await saveFile(createReadStream(), path.resolve(filePath));

    const { base, coverImage } = await getEPubMetadata(path.resolve(filePath));

    writeFileSync(path.resolve(coverPath), await coverImage);

    const authors = await Promise.all(
      base.creators.map(async ({ name }) => {
        return await Author.findOrCreate({ name });
      })
    );

    const book = await Book.findOrCreate({
      isbn: base.identifiers[0].value as string,
      title: base.titles[0],
      description: base.description,
      publisher: base.publisher,
      coverPath,
      authors,
    });

    const epub = await this.repository.create({
      filename,
      filePath,
      book,
    });

    await this.repository.save(epub);
    return epub;
  }

  @Mutation((returns) => EPub)
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
