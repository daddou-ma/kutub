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
import { connectionFromRepository } from "Relay/Connection.factory";
import {
  CreateQuoteInput,
  UpdateQuoteInput,
} from "Modules/quotes/Quote.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import Quote from "Modules/quotes/Quote.entity";
import Author from "Modules/authors/Author.entity";
import User from "Modules/users/User.entity";
import { QuoteConnection } from "Modules/quotes/Quote.connection";

@Resolver(() => Quote)
export default class QuoteResolver {
  @InjectRepository(Quote, "prod")
  private readonly repository!: Repository<Quote>;

  @Authorized(["ANY"])
  @FieldResolver()
  async author(@Root() quote: Quote, @Ctx() { db }: Context): Promise<Author> {
    return await db.manager
      .createQueryBuilder()
      .relation(Quote, "author")
      .of(quote)
      .loadOne();
  }

  @Authorized("USER")
  @FieldResolver()
  async favorited(
    @Root() quote: Quote,
    @Ctx() { db, user }: Context
  ): Promise<boolean> {
    const [{ favorited }] = await db.manager.query(
      `SELECT DISTINCT EXISTS(SELECT * FROM user_favorite_quotes_quote
        WHERE quoteId='${quote.id}' AND userId='${user.id}') as favorited;`
    );
    return Boolean(Number(favorited));
  }

  @Authorized(["ADMIN"])
  @Query(() => QuoteConnection)
  async quotes(@Args() args: ConnectionArguments): Promise<QuoteConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized("ADMIN")
  @Query(() => Quote)
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

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => Quote)
  async favoriteQuote(
    @Arg("quoteId") quoteId: string,
    @Ctx() { db, user }: Context
  ): Promise<Quote> {
    const quote = await db.manager.findOne(Quote, quoteId);
    const me = await db.manager.findOne(User, user.id, {
      relations: ["favoriteQuotes"],
    });
    me.favoriteQuotes = [...me.favoriteQuotes, quote];
    await db.manager.save(me);
    return quote;
  }

  @Authorized(["ADMIN", "USER"])
  @Mutation(() => Quote)
  async unFavoriteQuote(
    @Arg("quoteId") quoteId: string,
    @Ctx() { db, user }: Context
  ): Promise<Quote> {
    const quote = await db.manager.findOne(Quote, quoteId);
    const me = await db.manager.findOne(User, user.id, {
      relations: ["favoriteQuotes"],
    });
    me.favoriteQuotes = me.favoriteQuotes.filter(
      (quote) => quote.id !== Number(quoteId)
    );
    await db.manager.save(me);
    return quote;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Quote)
  async createQuote(
    @Arg("data") input: CreateQuoteInput,
    @Ctx() { db }: Context
  ): Promise<Quote> {
    const quote = db.manager.create(Quote, input);
    await db.manager.save(Quote);
    return quote;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Quote)
  async updateQuote(
    @Arg("quoteId") quoteId: string,
    @Arg("data") input: UpdateQuoteInput,
    @Ctx() { db }: Context
  ): Promise<Quote> {
    await db.manager.update(Quote, quoteId, input);
    return db.manager.findOne(Quote, quoteId);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Quote)
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
