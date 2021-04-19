import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { BookEdge } from "Modules/books/Book.edge";

@ObjectType()
export class BookConnection extends ConnectionType(BookEdge) {}
