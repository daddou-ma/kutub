import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Metadata from "Modules/metadatas/Metadata.entity";

@ObjectType()
export class MetadataEdge extends EdgeType(Metadata) {}
