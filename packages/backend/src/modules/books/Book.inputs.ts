import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Book from "Modules/books/Book.entity";

@InputType({ description: "Create Book data" })
export class CreateBookInput implements Partial<Book> {
  @Field()
  @MaxLength(64)
  isbn: string;

  @Field()
  @MaxLength(512)
  title: string;

  @Field()
  @MaxLength(2048)
  description: string;
}

@InputType({ description: "Update Book data" })
export class UpdateBookInput implements Partial<Book> {
  @Field()
  @MaxLength(512)
  title: string;
}
