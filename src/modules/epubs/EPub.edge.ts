import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import EPub from "Modules/epubs/EPub.entity";

@ObjectType()
export class EPubEdge extends EdgeType(EPub) {}
