import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
  Args,
} from "type-graphql";
import Author from "Modules/authors/Author.entity";
import {
  CreateAuthorInput,
  UpdateAuthorInput,
} from "Modules/authors/Author.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import { QuoteConnection } from "Modules/quotes/Quote.connection";
import { BookConnection } from "Modules/books/Book.connection";
import {
  connectionFromRelation,
  connectionFromRepository,
} from "Relay/Connection.factory";
import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { AuthorConnection } from "./Author.connection";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Resolver(() => Author)
export default class AuthorResolver {
  @InjectRepository(Author, "prod")
  private readonly repository!: Repository<Author>;

  @FieldResolver(() => QuoteConnection)
  async quotes(
    @Root() author: Author,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<QuoteConnection> {
    return connectionFromRelation(args, db, Author, "quotes", author);
  }

  @FieldResolver(() => BookConnection)
  async books(
    @Root() author: Author,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<BookConnection> {
    return connectionFromRelation(args, db, Author, "books", author);
  }

  @Query(() => AuthorConnection)
  async authors(@Args() args: ConnectionArguments): Promise<AuthorConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Query(() => Author)
  async authorById(
    @Arg("authorId") authorId: string,
    @Ctx() { db }: Context
  ): Promise<Author> {
    try {
      return await db.manager.findOneOrFail(Author, authorId);
    } catch (error) {
      throw new UserInputError("No Author Found with this id");
    }
  }

  @Mutation(() => Author)
  async createAuthor(
    @Arg("data") input: CreateAuthorInput,
    @Ctx() { db }: Context
  ): Promise<Author> {
    const author = db.manager.create(Author, input);
    await db.manager.save(Author);
    return author;
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Arg("authorId") authorId: string,
    @Arg("data") input: UpdateAuthorInput,
    @Ctx() { db }: Context
  ): Promise<Author> {
    await db.manager.update(Author, authorId, input);
    return db.manager.findOne(Author, authorId);
  }

  @Mutation(() => Author)
  async deleteAuthor(
    @Arg("authorId") authorId: string,
    @Ctx() { db }: Context
  ): Promise<Author> {
    try {
      const author = await db.manager.findOneOrFail(Author, authorId);
      await db.manager.remove(author);
      return author;
    } catch (error) {
      throw new UserInputError("No Author Found with this id");
    }
  }
}
