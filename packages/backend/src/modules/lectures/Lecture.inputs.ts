import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Lecture from "Modules/lectures/Lecture.entity";
import { CreateMetadataInput } from "Modules/metadatas/Metadata.inputs";

@InputType({ description: "Create Lecture data" })
export class CreateLectureInput {
  @Field((type) => CreateMetadataInput)
  metadata: CreateMetadataInput;
}

@InputType({ description: "Update Lecture data" })
export class UpdateLectureInput implements Partial<Lecture> {
  @Field()
  @MaxLength(256)
  location?: string;

  @Field()
  progress?: number;
}
