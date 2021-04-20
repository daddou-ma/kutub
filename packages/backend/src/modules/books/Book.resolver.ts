import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  Args,
  FieldResolver,
  Root,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { connectionFromRepository } from "Relay/Connection.factory";
import { CreateBookInput, UpdateBookInput } from "Modules/books/inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Book from "Modules/books/Book.entity";
import Author from "Modules/authors/Author.entity";
import User from "Modules/users/User.entity";
import { BookConnection } from "Modules/books/Book.connection";
import EPub from "Modules/epubs/EPub.entity";

@Resolver((of) => Book)
export default class BookResolver {
  @InjectRepository(Book, "prod")
  private readonly repository!: Repository<Book>;

  @FieldResolver()
  async authors(@Root() book: Book, @Ctx() { db }: Context): Promise<Author[]> {
    return await db.manager
      .createQueryBuilder()
      .relation(Book, "authors")
      .of(book)
      .loadMany();
  }

  @FieldResolver()
  async epub(@Root() book: Book, @Ctx() { db }: Context): Promise<EPub> {
    return await db.manager
      .createQueryBuilder()
      .relation(Book, "epub")
      .of(book)
      .loadOne();
  }

  @Query((returns) => BookConnection)
  async books(@Args() args: ConnectionArguments): Promise<BookConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Query((returns) => Book)
  async bookById(
    @Arg("bookId") bookId: string,
    @Ctx() { db }: Context
  ): Promise<Book> {
    try {
      return await db.manager.findOneOrFail(Book, bookId);
    } catch (error) {
      throw new UserInputError("No Book Found with this id");
    }
  }

  @Mutation((returns) => Book)
  async createBook(
    @Arg("data") input: CreateBookInput,
    @Ctx() { db }: Context
  ): Promise<Book> {
    const book = db.manager.create(Book, input);
    await db.manager.save(Book);
    return book;
  }

  @Mutation((returns) => Book)
  async updateBook(
    @Arg("bookId") bookId: string,
    @Arg("data") input: UpdateBookInput,
    @Ctx() { db }: Context
  ): Promise<Book> {
    await db.manager.update(Book, bookId, input);
    return db.manager.findOne(Book, bookId);
  }

  @Mutation((returns) => Book)
  async deleteBook(
    @Arg("bookId") bookId: string,
    @Ctx() { db }: Context
  ): Promise<Book> {
    try {
      const book = await db.manager.findOneOrFail(Book, bookId);
      await db.manager.remove(book);
      return book;
    } catch (error) {
      throw new UserInputError("No Book Found with this id");
    }
  }
}
