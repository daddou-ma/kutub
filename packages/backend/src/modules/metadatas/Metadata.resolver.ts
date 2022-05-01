import {
  Resolver,
  Query,
  Arg,
  Args,
  FieldResolver,
  Root,
  Ctx,
  Authorized,
} from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { ConnectionArguments } from "Relay/generics/ConnectionsArguments";
import { connectionFromRelation, connectionFromRepository } from "Relay/Connection.factory";
import { UserInputError } from "apollo-server";

import Metadata from "Modules/metadatas/Metadata.entity";
import User from "Modules/users/User.entity";
import { MetadataConnection } from "Modules/metadatas/Metadata.connection";
import Context from "Interfaces/Context";
import EPub from "Modules/epubs/EPub.entity";

@Resolver(() => Metadata)
export default class MetadataResolver {
  @InjectRepository(Metadata, "prod")
  private readonly repository!: Repository<Metadata>;

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => User, { nullable: true })
  async createdBy(@Root() metadata: Metadata): Promise<User> {
    return await this.repository
      .createQueryBuilder()
      .relation(Metadata, "createdBy")
      .of(metadata)
      .loadOne();
  }

  @Authorized(["ADMIN", "USER"])
  @FieldResolver(() => EPub)
  async epub(@Root() metadata: Metadata): Promise<EPub> {
    return await this.repository
      .createQueryBuilder()
      .relation(Metadata, "epub")
      .of(metadata)
      .loadOne();
  }

  @Authorized("ADMIN")
  @Query(() => MetadataConnection)
  async metadatas(@Args() args: ConnectionArguments): Promise<MetadataConnection> {
    return connectionFromRepository(args, this.repository);
  }

  @Authorized(["ADMIN", "USER"])
  @Query(() => Metadata)
  async metadataById(@Arg("metadataId") metadataId: string, @Ctx() { user }: Context): Promise<Metadata> {
    try {
      const metadata = await this.repository.findOneOrFail(metadataId, { relations: ["createdBy"]});

      return await metadata;
    } catch (error) {
      throw new UserInputError("No Metadata Found with this id");
    }
  }
}
