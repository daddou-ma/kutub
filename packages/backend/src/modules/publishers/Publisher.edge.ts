import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Publisher from "Modules/publishers/Publisher.entity";

@ObjectType()
export class PublisherEdge extends EdgeType(Publisher) {}
