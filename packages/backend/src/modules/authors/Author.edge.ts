import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Author from "Modules/authors/Author.entity";

@ObjectType()
export class AuthorEdge extends EdgeType(Author) {}
