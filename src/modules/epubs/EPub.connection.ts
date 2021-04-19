import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { EPubEdge } from "Modules/epubs/EPub.edge";

@ObjectType()
export class EPubConnection extends ConnectionType(EPubEdge) {}
