import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Quote from "Entities/Quote.entity";

@InputType({ description: "Create Quote data" })
export class CreateQuoteInput implements Partial<Quote> {
  @Field()
  @MaxLength(512)
  content: string;

  @Field()
  @MaxLength(128)
  authorID: string;
}

@InputType({ description: "Update Quote data" })
export class UpdateQuoteInput implements Partial<Quote> {
  @Field()
  @MaxLength(512)
  content: string;

  @Field()
  @MaxLength(128)
  authorID: string;
}
