import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import { CreateQuoteInput, UpdateQuoteInput } from "Inputs/Quote";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Quote from "Entities/Quote.entity";
import Author from "Entities/Author.entity";

@Resolver((of) => Quote)
export default class QuoteResolver {
  @FieldResolver()
  async author(
    @Root() quote: Quote,
    @Ctx() { manager }: Context
  ): Promise<Author> {
    return await manager
      .createQueryBuilder()
      .relation(Quote, "author")
      .of(quote)
      .loadOne();
  }

  @Query((returns) => [Quote])
  async quotes(@Ctx() { manager }: Context): Promise<Quote[]> {
    return await manager.find(Quote, {});
  }

  @Query((returns) => Quote)
  async quoteById(
    @Arg("quoteId") quoteId: string,
    @Ctx() { manager }: Context
  ): Promise<Quote> {
    try {
      return await manager.findOneOrFail(Quote, quoteId);
    } catch (error) {
      throw new UserInputError("No Quote Found with this id");
    }
  }

  @Mutation((returns) => Quote)
  async createQuote(
    @Arg("data") input: CreateQuoteInput,
    @Ctx() { manager }: Context
  ): Promise<Quote> {
    const quote = manager.create(Quote, input);
    await manager.save(Quote);
    return quote;
  }

  @Mutation((returns) => Quote)
  async updateQuote(
    @Arg("quoteId") quoteId: string,
    @Arg("data") input: UpdateQuoteInput,
    @Ctx() { manager }: Context
  ): Promise<Quote> {
    await manager.update(Quote, quoteId, input);
    return manager.findOne(Quote, quoteId);
  }

  @Mutation((returns) => Quote)
  async deleteQuote(
    @Arg("quoteId") quoteId: string,
    @Ctx() { manager }: Context
  ): Promise<Quote> {
    try {
      const quote = await manager.findOneOrFail(Quote, quoteId);
      await manager.remove(quote);
      return quote;
    } catch (error) {
      throw new UserInputError("No Quote Found with this id");
    }
  }
}
