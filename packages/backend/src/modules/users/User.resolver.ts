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
import User from "Modules/users/User.entity";
import { CreateUserInput, UpdateUserInput } from "Modules/users/User.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import { EPubConnection } from "Modules/epubs/EPub.connection";
import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import {
  connectionFromRelation,
  connectionFromRepository,
} from "Relay/Connection.factory";
import { QuoteConnection } from "Modules/quotes/Quote.connection";
import { UserConnection } from "./User.connection";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Resolver(() => User)
export default class UserResolver {
  @InjectRepository(User, "prod")
  private readonly repository!: Repository<User>;

  @FieldResolver(() => EPubConnection)
  async epubs(
    @Root() user: User,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<EPubConnection> {
    return connectionFromRelation(args, db, User, "epubs", user);
  }

  @FieldResolver(() => QuoteConnection)
  async favoriteQuotes(
    @Root() user: User,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<QuoteConnection> {
    return connectionFromRelation(args, db, User, "favoriteQuotes", user);
  }

  @Query(() => UserConnection)
  async users(@Args() args: ConnectionArguments): Promise<UserConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Query(() => User)
  async userById(
    @Arg("userId") userId: string,
    @Ctx() { db }: Context
  ): Promise<User> {
    try {
      return await db.manager.findOneOrFail(User, userId);
    } catch (error) {
      throw new UserInputError("No User Found with this id");
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg("data") input: CreateUserInput,
    @Ctx() { db }: Context
  ): Promise<User> {
    const user = db.manager.create(User, input);
    await db.manager.save(user);
    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("userId") userId: string,
    @Arg("data") input: UpdateUserInput,
    @Ctx() { db }: Context
  ): Promise<User> {
    await db.manager.update(User, userId, input);
    return db.manager.findOne(User, userId);
  }

  @Mutation(() => User)
  async deleteUser(
    @Arg("userId") userId: string,
    @Ctx() { db }: Context
  ): Promise<User> {
    try {
      const user = await db.manager.findOneOrFail(User, userId);
      await db.manager.remove(User);
      return user;
    } catch (error) {
      throw new UserInputError("No User Found with this id");
    }
  }
}
