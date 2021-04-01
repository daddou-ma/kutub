import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import Author from "Entities/Author.entity";
import { CreateAuthorInput, UpdateAuthorInput } from "Inputs/Author";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Quote from "Entities/Quote.entity";

@Resolver((of) => Author)
export default class AuthorResolver {
  @FieldResolver()
  async quotes(
    @Root() author: Author,
    @Ctx() { manager }: Context
  ): Promise<Quote[]> {
    return await manager
      .createQueryBuilder()
      .relation(Author, "quotes")
      .of(author)
      .loadMany();
  }

  @Query((returns) => [Author])
  async authors(@Ctx() { manager }: Context): Promise<Author[]> {
    return await manager.find(Author, {});
  }

  @Query((returns) => Author)
  async authorById(
    @Arg("authorId") authorId: string,
    @Ctx() { manager }: Context
  ): Promise<Author> {
    try {
      return await manager.findOneOrFail(Author, authorId);
    } catch (error) {
      throw new UserInputError("No Author Found with this id");
    }
  }

  @Mutation((returns) => Author)
  async createAuthor(
    @Arg("data") input: CreateAuthorInput,
    @Ctx() { manager }: Context
  ): Promise<Author> {
    const author = manager.create(Author, input);
    await manager.save(Author);
    return author;
  }

  @Mutation((returns) => Author)
  async updateAuthor(
    @Arg("authorId") authorId: string,
    @Arg("data") input: UpdateAuthorInput,
    @Ctx() { manager }: Context
  ): Promise<Author> {
    await manager.update(Author, authorId, input);
    return manager.findOne(Author, authorId);
  }

  @Mutation((returns) => Author)
  async deleteAuthor(
    @Arg("authorId") authorId: string,
    @Ctx() { manager }: Context
  ): Promise<Author> {
    try {
      const author = await manager.findOneOrFail(Author, authorId);
      await manager.remove(author);
      return author;
    } catch (error) {
      throw new UserInputError("No Author Found with this id");
    }
  }
}
