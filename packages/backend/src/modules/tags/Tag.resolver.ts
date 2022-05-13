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
import Tag from "Modules/tags/Tag.entity";
import {
  CreateTagInput,
  UpdateTagInput,
} from "Modules/tags/Tag.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import { BookConnection } from "Modules/books/Book.connection";
import {
  connectionFromRelation,
  connectionFromRepository,
} from "Relay/Connection.factory";
import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { TagConnection } from "./Tag.connection";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Resolver(() => Tag)
export default class TagResolver {
  @InjectRepository(Tag, "prod")
  private readonly repository!: Repository<Tag>;

  @Authorized("ADMIN")
  @FieldResolver(() => BookConnection)
  async books(
    @Root() tag: Tag,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<BookConnection> {
    return connectionFromRelation(args, db, Tag, "books", tag);
  }

  @Authorized("ADMIN")
  @Query(() => TagConnection)
  async tags(@Args() args: ConnectionArguments): Promise<TagConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized("ADMIN")
  @Query(() => Tag)
  async tagById(
    @Arg("tagId") tagId: string,
    @Ctx() { db }: Context
  ): Promise<Tag> {
    try {
      return await db.manager.findOneOrFail(Tag, tagId);
    } catch (error) {
      throw new UserInputError("No Tag Found with this id");
    }
  }

  @Authorized("ADMIN")
  @Mutation(() => Tag)
  async createTag(
    @Arg("data") input: CreateTagInput,
    @Ctx() { db }: Context
  ): Promise<Tag> {
    const tag = db.manager.create(Tag, input);
    await db.manager.save(Tag);
    return tag;
  }

  @Authorized("ADMIN")
  @Mutation(() => Tag)
  async updateTag(
    @Arg("tagId") tagId: string,
    @Arg("data") input: UpdateTagInput,
    @Ctx() { db }: Context
  ): Promise<Tag> {
    await db.manager.update(Tag, tagId, input);
    return db.manager.findOne(Tag, tagId);
  }

  @Authorized("ADMIN")
  @Mutation(() => Tag)
  async deleteTag(
    @Arg("tagId") tagId: string,
    @Ctx() { db }: Context
  ): Promise<Tag> {
    try {
      const tag = await db.manager.findOneOrFail(Tag, tagId);
      await db.manager.remove(tag);
      return tag;
    } catch (error) {
      throw new UserInputError("No Tag Found with this id");
    }
  }
}
