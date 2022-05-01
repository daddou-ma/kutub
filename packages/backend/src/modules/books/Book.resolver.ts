import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  Args,
  FieldResolver,
  Root,
  Authorized,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import {
  connectionFromRelation,
  connectionFromRepository,
} from "Relay/Connection.factory";
import { CreateBookInput, UpdateBookInput } from "Modules/books/Book.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Book from "Modules/books/Book.entity";
import Publisher from "Modules/publishers/Publisher.entity";
import { BookConnection } from "Modules/books/Book.connection";
import { AuthorConnection } from "Modules/authors/Author.connection";

@Resolver(() => Book)
export default class BookResolver {
  @InjectRepository(Book, "prod")
  private readonly repository!: Repository<Book>;

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => Publisher)
  async publisher(
    @Root() book: Book,
    @Ctx() { db }: Context
  ): Promise<Publisher> {
    return await db.manager
      .createQueryBuilder()
      .relation(Book, "publisher")
      .of(book)
      .loadOne();
  }

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => AuthorConnection)
  async authors(
    @Root() book: Book,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<AuthorConnection> {
    return connectionFromRelation(args, db, Book, "authors", book);
  }

  @Authorized("ADMIN")
  @Query(() => BookConnection)
  async books(@Args() args: ConnectionArguments): Promise<BookConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized("ADMIN")
  @Query(() => Book)
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

  @Authorized("ADMIN")
  @Mutation(() => Book)
  async createBook(
    @Arg("data") input: CreateBookInput,
    @Ctx() { db }: Context
  ): Promise<Book> {
    const book = db.manager.create(Book, input);
    await db.manager.save(Book);
    return book;
  }

  @Authorized("ADMIN")
  @Mutation(() => Book)
  async updateBook(
    @Arg("bookId") bookId: string,
    @Arg("data") input: UpdateBookInput,
    @Ctx() { db }: Context
  ): Promise<Book> {
    await db.manager.update(Book, bookId, input);
    return db.manager.findOne(Book, bookId);
  }

  @Authorized("ADMIN")
  @Mutation(() => Book)
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
