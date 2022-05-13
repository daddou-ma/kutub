import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { TagEdge } from "Modules/tags/Tag.edge";

@ObjectType()
export class TagConnection extends ConnectionType(TagEdge) {}
