import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { CategoryEdge } from "Modules/categories/Category.edge";

@ObjectType()
export class CategoryConnection extends ConnectionType(CategoryEdge) {}
