import { Resolver, Query, Mutation, Ctx, Arg } from "type-graphql";
import User from "Entities/User.entity";
import { CreateUserInput, UpdateUserInput } from "Inputs/User";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";

@Resolver((of) => User)
export default class UserResolver {
  @Query((returns) => [User])
  async users(@Ctx() { db }: Context): Promise<User[]> {
    return await db.manager.find(User, {});
  }

  @Query((returns) => User)
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

  @Mutation((returns) => User)
  async createUser(
    @Arg("data") input: CreateUserInput,
    @Ctx() { db }: Context
  ): Promise<User> {
    const user = db.manager.create(User, input);
    await db.manager.save(user);
    return user;
  }

  @Mutation((returns) => User)
  async updateUser(
    @Arg("userId") userId: string,
    @Arg("data") input: UpdateUserInput,
    @Ctx() { db }: Context
  ): Promise<User> {
    await db.manager.update(User, userId, input);
    return db.manager.findOne(User, userId);
  }

  @Mutation((returns) => User)
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
