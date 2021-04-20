import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Quote from "Modules/quotes/Quote.entity";

@ObjectType()
export class QuoteEdge extends EdgeType(Quote) {}
