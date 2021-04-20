import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import EPub from "Modules/epubs/EPub.entity";

@InputType({ description: "Update EPub data" })
export class UpdateEPubInput implements Partial<EPub> {
  @Field()
  @MaxLength(512)
  filename: string;
}
