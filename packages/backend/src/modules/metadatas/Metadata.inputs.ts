import { Field, InputType } from "type-graphql";
import Metadata from "Modules/metadatas/Metadata.entity";

@InputType({ description: "Create Metadata data" })
export class CreateMetadataInput implements Partial<Metadata> {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  description: string;

  @Field()
  isbn: string;

  @Field()
  language: string;

  @Field()
  publisher: string;

  @Field(() => Date)
  publishedAt: Date;
}
