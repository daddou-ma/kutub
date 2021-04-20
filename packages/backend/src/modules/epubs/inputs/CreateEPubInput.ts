import { Field, InputType } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { Stream } from "stream";

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
