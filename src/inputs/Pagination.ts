import { Field, InputType, ID, Int } from "type-graphql";

@InputType()
export class PaginationInputType {
  @Field(() => Int)
  first: number;

  @Field(() => ID)
  before?: string;

  @Field(() => ID)
  after?: string;
}
