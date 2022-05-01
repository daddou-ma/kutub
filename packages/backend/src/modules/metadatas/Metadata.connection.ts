import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { MetadataEdge } from "Modules/metadatas/Metadata.edge";

@ObjectType()
export class MetadataConnection extends ConnectionType(MetadataEdge) {}
