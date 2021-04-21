import { ObjectType } from "type-graphql";

import { ConnectionType } from "Relay/generics/Connection";
import { UserEdge } from "Modules/users/User.edge";

@ObjectType()
export class UserConnection extends ConnectionType(UserEdge) {}
