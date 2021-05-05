import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
  Args,
  Authorized
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

  @Authorized(["USER"])
  @FieldResolver(() => EPubConnection)
  async epubs(
    @Root() user: User,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<EPubConnection> {
    return connectionFromRelation(args, db, User, "epubs", user);
  }

  @Authorized(["USER"])
  @FieldResolver(() => QuoteConnection)
  async favoriteQuotes(
    @Root() user: User,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<QuoteConnection> {
    return connectionFromRelation(args, db, User, "favoriteQuotes", user);
  }

  @Authorized(["ADMIN"])
  @Query(() => UserConnection)
  async users(@Args() args: ConnectionArguments): Promise<UserConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized(["ADMIN"])
  @Query(() => User)
  async userById(@Arg("userId") userId: string): Promise<User> {
    try {
      return await this.repository.findOneOrFail(userId);
    } catch (error) {
      throw new UserInputError("No User Found with this id");
    }
  }

  @Authorized(["ADMIN"])
  @Mutation(() => User)
  async createUser(@Arg("data") input: CreateUserInput): Promise<User> {
    const user = this.repository.create(input);
    await this.repository.save(user);
    return user;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => User)
  async updateUser(
    @Arg("userId") userId: string,
    @Arg("data") input: UpdateUserInput
  ): Promise<User> {
    await this.repository.update(userId, input);
    return this.repository.findOne(userId);
  }

  @Authorized(["ADMIN"])
  @Mutation(() => User)
  async deleteUser(@Arg("userId") userId: string): Promise<User> {
    try {
      const user = await this.repository.findOneOrFail(userId);
      await this.repository.remove(user);
      return user;
    } catch (error) {
      throw new UserInputError("No User Found with this id");
    }
  }
}
