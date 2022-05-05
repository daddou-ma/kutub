import { Field, InputType } from "type-graphql";
import Metadata from "Modules/metadatas/Metadata.entity";

@InputType({ description: "Create Metadata data" })
export class CreateMetadataInput implements Partial<Metadata> {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  isbn?: string;

  @Field({ nullable: true })
  language?: string;

  @Field({ nullable: true })
  publisher?: string;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date;
}
