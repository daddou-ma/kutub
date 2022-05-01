import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { AuthorEdge } from "Modules/authors/Author.edge";

@ObjectType()
export class AuthorConnection extends ConnectionType(AuthorEdge) {}
