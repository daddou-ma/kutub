import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import base64 from "base-64";

import { CreateQuoteInput, UpdateQuoteInput } from "Inputs/Quote";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Quote from "Entities/Quote.entity";
import Author from "Entities/Author.entity";
import { PaginationInputType } from "Inputs/Pagination";

@Resolver((of) => Quote)
export default class QuoteResolver {
  @FieldResolver()
  async author(@Root() quote: Quote, @Ctx() { db }: Context): Promise<Author> {
    return await db.manager
      .createQueryBuilder()
      .relation(Quote, "author")
      .of(quote)
      .loadOne();
  }

  @Query((returns) => [Quote])
  async quotes(
    @Ctx() { db }: Context,
    @Arg("pagination", { nullable: true }) { first, after }: PaginationInputType
  ): Promise<Quote[]> {
    const cursor = after;
    console.log(cursor);
    const [quotes, count] = await db
      .getRepository(Quote)
      .createQueryBuilder("quotes")
      .where("quotes.id > :cursor", { cursor })
      .limit(25)
      .getManyAndCount();
    console.log(count);

    return quotes;
  }

  @Query((returns) => Quote)
  async quoteById(
    @Arg("quoteId") quoteId: string,
    @Ctx() { db }: Context
  ): Promise<Quote> {
    try {
      return await db.manager.findOneOrFail(Quote, quoteId);
    } catch (error) {
      throw new UserInputError("No Quote Found with this id");
    }
  }

  @Mutation((returns) => Quote)
  async createQuote(
    @Arg("data") input: CreateQuoteInput,
    @Ctx() { db }: Context
  ): Promise<Quote> {
    const quote = db.manager.create(Quote, input);
    await db.manager.save(Quote);
    return quote;
  }

  @Mutation((returns) => Quote)
  async updateQuote(
    @Arg("quoteId") quoteId: string,
    @Arg("data") input: UpdateQuoteInput,
    @Ctx() { db }: Context
  ): Promise<Quote> {
    await db.manager.update(Quote, quoteId, input);
    return db.manager.findOne(Quote, quoteId);
  }

  @Mutation((returns) => Quote)
  async deleteQuote(
    @Arg("quoteId") quoteId: string,
    @Ctx() { db }: Context
  ): Promise<Quote> {
    try {
      const quote = await db.manager.findOneOrFail(Quote, quoteId);
      await db.manager.remove(quote);
      return quote;
    } catch (error) {
      throw new UserInputError("No Quote Found with this id");
    }
  }
}
