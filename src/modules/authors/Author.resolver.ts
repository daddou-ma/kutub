import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import Author from "Modules/authors/Author.entity";
import { CreateAuthorInput, UpdateAuthorInput } from "Modules/authors/inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Quote from "Modules/quotes/Quote.entity";

@Resolver((of) => Author)
export default class AuthorResolver {
  @FieldResolver()
  async quotes(
    @Root() author: Author,
    @Ctx() { db }: Context
  ): Promise<Quote[]> {
    return await db.manager
      .createQueryBuilder()
      .relation(Author, "quotes")
      .of(author)
      .loadMany();
  }

  @Query((returns) => [Author])
  async authors(@Ctx() { db }: Context): Promise<Author[]> {
    return await db.manager.find(Author, {});
  }

  @Query((returns) => Author)
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

  @Mutation((returns) => Author)
  async createAuthor(
    @Arg("data") input: CreateAuthorInput,
    @Ctx() { db }: Context
  ): Promise<Author> {
    const author = db.manager.create(Author, input);
    await db.manager.save(Author);
    return author;
  }

  @Mutation((returns) => Author)
  async updateAuthor(
    @Arg("authorId") authorId: string,
    @Arg("data") input: UpdateAuthorInput,
    @Ctx() { db }: Context
  ): Promise<Author> {
    await db.manager.update(Author, authorId, input);
    return db.manager.findOne(Author, authorId);
  }

  @Mutation((returns) => Author)
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
