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
import Publisher from "Modules/publishers/Publisher.entity";
import {
  CreatePublisherInput,
  UpdatePublisherInput,
} from "Modules/publishers/Publisher.inputs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import { BookConnection } from "Modules/books/Book.connection";
import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import {
  connectionFromRelation,
  connectionFromRepository,
} from "Relay/Connection.factory";
import { PublisherConnection } from "./Publisher.connection";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Resolver(() => Publisher)
export default class PublisherResolver {
  @InjectRepository(Publisher, "prod")
  private readonly repository!: Repository<Publisher>;

  @Authorized("ADMIN")
  @FieldResolver(() => BookConnection)
  async books(
    @Root() publisher: Publisher,
    @Args() args: ConnectionArguments,
    @Ctx() { db }: Context
  ): Promise<BookConnection> {
    return connectionFromRelation(args, db, Publisher, "books", publisher);
  }

  @Authorized("ADMIN")
  @Query(() => PublisherConnection)
  async publishers(
    @Args() args: ConnectionArguments
  ): Promise<PublisherConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized("ADMIN")
  @Query(() => Publisher)
  async publisherById(
    @Arg("publisherId") publisherId: string,
    @Ctx() { db }: Context
  ): Promise<Publisher> {
    try {
      return await db.manager.findOneOrFail(Publisher, publisherId);
    } catch (error) {
      throw new UserInputError("No Publisher Found with this id");
    }
  }

  @Authorized("ADMIN")
  @Mutation(() => Publisher)
  async createPublisher(
    @Arg("data") input: CreatePublisherInput,
    @Ctx() { db }: Context
  ): Promise<Publisher> {
    const publisher = db.manager.create(Publisher, input);
    await db.manager.save(Publisher);
    return publisher;
  }

  @Authorized("ADMIN")
  @Mutation(() => Publisher)
  async updatePublisher(
    @Arg("publisherId") publisherId: string,
    @Arg("data") input: UpdatePublisherInput,
    @Ctx() { db }: Context
  ): Promise<Publisher> {
    await db.manager.update(Publisher, publisherId, input);
    return db.manager.findOne(Publisher, publisherId);
  }
  
  @Authorized("ADMIN")
  @Mutation(() => Publisher)
  async deletePublisher(
    @Arg("publisherId") publisherId: string,
    @Ctx() { db }: Context
  ): Promise<Publisher> {
    try {
      const publisher = await db.manager.findOneOrFail(Publisher, publisherId);
      await db.manager.remove(publisher);
      return publisher;
    } catch (error) {
      throw new UserInputError("No Publisher Found with this id");
    }
  }
}
