import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Book from "Modules/books/Book.entity";

@InputType({ description: "Update Book data" })
export class UpdateBookInput implements Partial<Book> {
  @Field()
  @MaxLength(512)
  title: string;
}
