import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Publisher from "Modules/publishers/Publisher.entity";

@InputType({ description: "Create Publisher data" })
export class CreatePublisherInput implements Partial<Publisher> {
  @Field()
  @MaxLength(48)
  name: string;
}

@InputType({ description: "Update Publisher data" })
export class UpdatePublisherInput implements Partial<Publisher> {
  @Field()
  @MaxLength(48)
  name: string;
}
