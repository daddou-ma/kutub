import * as Relay from "graphql-relay";
import { Field, ArgsType, ObjectType, ClassType } from "type-graphql";

@ArgsType()
export class PaginationArguments {
  @Field({ nullable: true, description: "Paginate before opaque cursor" })
  before?: number;
  @Field({ nullable: true, description: "Paginate after opaque cursor" })
  after?: number;
  @Field({ nullable: true, description: "Paginate first" })
  first?: number;
  @Field({ nullable: true, description: "Paginate last" })
  last?: number;
}
