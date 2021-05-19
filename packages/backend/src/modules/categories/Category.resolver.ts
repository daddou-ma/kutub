import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Arg,
  FieldResolver,
  Root,
  Args,
  Authorized,
} from "type-graphql";
import Category from "Modules/categories/Category.entity";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "Modules/categories/Category.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import { BookConnection } from "Modules/books/Book.connection";
import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import {
  connectionFromRelation,
  connectionFromRepository,
} from "Relay/Connection.factory";
import { CategoryConnection } from "./Category.connection";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Resolver(() => Category)
export default class CategoryResolver {
  @InjectRepository(Category, "prod")
  private readonly repository!: Repository<Category>;

  @Authorized("ADMIN")
  @FieldResolver(() => BookConnection)
  async books(
    @Root() category: Category,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<BookConnection> {
    return connectionFromRelation(args, db, Category, "books", category);
  }

  @Authorized("ADMIN")
  @Query(() => CategoryConnection)
  async categories(
    @Args() args: ConnectionArguments
  ): Promise<CategoryConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized("ADMIN")
  @Query(() => Category)
  async categoryById(
    @Arg("categoryId") categoryId: string,
    @Ctx() { db }: Context
  ): Promise<Category> {
    try {
      return await db.manager.findOneOrFail(Category, categoryId);
    } catch (error) {
      throw new UserInputError("No Category Found with this id");
    }
  }

  @Authorized("ADMIN")
  @Mutation(() => Category)
  async createCategory(
    @Arg("data") input: CreateCategoryInput,
    @Ctx() { db }: Context
  ): Promise<Category> {
    const category = db.manager.create(Category, input);
    await db.manager.save(Category);
    return category;
  }

  @Authorized("ADMIN")
  @Mutation(() => Category)
  async updateCategory(
    @Arg("categoryId") categoryId: string,
    @Arg("data") input: UpdateCategoryInput,
    @Ctx() { db }: Context
  ): Promise<Category> {
    await db.manager.update(Category, categoryId, input);
    return db.manager.findOne(Category, categoryId);
  }
  
  @Authorized("ADMIN")
  @Mutation(() => Category)
  async deleteCategory(
    @Arg("categoryId") categoryId: string,
    @Ctx() { db }: Context
  ): Promise<Category> {
    try {
      const category = await db.manager.findOneOrFail(Category, categoryId);
      await db.manager.remove(category);
      return category;
    } catch (error) {
      throw new UserInputError("No Category Found with this id");
    }
  }
}
