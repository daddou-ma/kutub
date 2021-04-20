import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Quote from "Modules/quotes/Quote.entity";

@InputType({ description: "Create Quote data" })
export class CreateQuoteInput implements Partial<Quote> {
  @Field()
  @MaxLength(512)
  content: string;

  @Field()
  @MaxLength(128)
  authorID: string;
}
