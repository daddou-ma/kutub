import { Field, InputType } from "type-graphql";
import { MaxLength, Length } from "class-validator";
import User from "Modules/users/User.entity";

@InputType({ description: "Update User data" })
export class UpdateUserInput implements Partial<User> {
  @Field()
  @MaxLength(64)
  email: string;

  @Field()
  @Length(8, 64)
  password: string;
}
