import { Resolver, Query, Mutation, Ctx, Arg } from "type-graphql";
import User from "Entities/User.entity";
import { CreateUserInput, UpdateUserInput } from "Inputs/User";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";

@Resolver((of) => User)
export default class UserResolver {
  @Query((returns) => [User])
  async users(@Ctx() { manager }: Context): Promise<User[]> {
    return await manager.find(User, {});
  }

  @Query((returns) => User)
  async userById(
    @Arg("userId") userId: string,
    @Ctx() { manager }: Context
  ): Promise<User> {
    try {
      return await manager.findOneOrFail(User, userId);
    } catch (error) {
      throw new UserInputError("No User Found with this id");
    }
  }

  @Mutation((returns) => User)
  async createUser(
    @Arg("data") input: CreateUserInput,
    @Ctx() { manager }: Context
  ): Promise<User> {
    const user = manager.create(User, input);
    await manager.save(user);
    return user;
  }

  @Mutation((returns) => User)
  async updateUser(
    @Arg("userId") userId: string,
    @Arg("data") input: UpdateUserInput,
    @Ctx() { manager }: Context
  ): Promise<User> {
    await manager.update(User, userId, input);
    return manager.findOne(User, userId);
  }

  @Mutation((returns) => User)
  async deleteUser(
    @Arg("userId") userId: string,
    @Ctx() { manager }: Context
  ): Promise<User> {
    try {
      const user = await manager.findOneOrFail(User, userId);
      await manager.remove(User);
      return user;
    } catch (error) {
      throw new UserInputError("No User Found with this id");
    }
  }
}
