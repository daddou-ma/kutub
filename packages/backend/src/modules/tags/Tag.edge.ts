import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Tag from "Modules/tags/Tag.entity";

@ObjectType()
export class TagEdge extends EdgeType(Tag) {}
