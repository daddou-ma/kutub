import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Author from "Modules/authors/Author.entity";

@InputType({ description: "Create Author data" })
export class CreateAuthorInput implements Partial<Author> {
  @Field()
  @MaxLength(48)
  name: string;
}
