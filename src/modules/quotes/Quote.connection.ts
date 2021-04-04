import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { QuoteEdge } from "Modules/quotes/Quote.edge";

@ObjectType()
export class QuoteConnection extends ConnectionType(QuoteEdge) {}
