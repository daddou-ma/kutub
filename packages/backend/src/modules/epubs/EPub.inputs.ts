import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import EPub from "Modules/epubs/EPub.entity";
import { CreateMetadataInput } from "Modules/metadatas/Metadata.inputs";

@InputType({ description: "Create EPub data" })
export class CreateEPubInput {
  @Field((type) => CreateMetadataInput)
  metadata: CreateMetadataInput;
}

@InputType({ description: "Update EPub data" })
export class UpdateEPubInput implements Partial<EPub> {
  @Field()
  @MaxLength(256)
  location?: string;

  @Field()
  progress?: number;
}
