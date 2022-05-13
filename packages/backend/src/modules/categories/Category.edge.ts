import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import Category from "Modules/categories/Category.entity";

@ObjectType()
export class CategoryEdge extends EdgeType(Category) {}
