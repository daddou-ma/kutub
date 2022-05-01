import { ObjectType } from "type-graphql";

import { EdgeType } from "Relay/generics/Edge";
import User from "Modules/users/User.entity";

@ObjectType()
export class UserEdge extends EdgeType(User) {}
