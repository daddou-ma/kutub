import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Tag from "Modules/tags/Tag.entity";

@InputType({ description: "Create Tag data" })
export class CreateTagInput implements Partial<Tag> {
  @Field()
  @MaxLength(48)
  name: string;
}

@InputType({ description: "Update Tag data" })
export class UpdateTagInput implements Partial<Tag> {
  @Field()
  @MaxLength(48)
  name: string;
}
