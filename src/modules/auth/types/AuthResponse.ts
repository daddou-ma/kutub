import { ObjectType, Field } from "type-graphql";
import User from "Modules/users/User.entity";

@ObjectType()
export class AuthResponse {
  @Field()
  public token: string;

  @Field((type) => User)
  public user: User;
}
