import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Book from "Modules/books/Book.entity";

@ObjectType()
export class BookEdge extends EdgeType(Book) {}
