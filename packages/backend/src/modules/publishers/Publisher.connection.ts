import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { PublisherEdge } from "Modules/publishers/Publisher.edge";

@ObjectType()
export class PublisherConnection extends ConnectionType(PublisherEdge) {}
