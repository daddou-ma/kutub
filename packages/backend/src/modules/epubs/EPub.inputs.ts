import { Field, InputType } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { MaxLength } from "class-validator";
import { Stream } from "stream";
import EPub from "Modules/epubs/EPub.entity";

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType({ description: "Create EPub data" })
export class CreateEPubInput {
  @Field((type) => GraphQLUpload)
  upload: Upload;
}

@InputType({ description: "Create EPub data" })
export class UpdateEPubInput implements Partial<EPub> {
  @Field()
  @MaxLength(256)
  location?: string;

  @Field()
  progress?: number;
}
