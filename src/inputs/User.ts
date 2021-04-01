import { Field, InputType } from "type-graphql";
import { MaxLength, Length } from "class-validator";
import User from "Entities/User.entity";

@InputType({ description: "Create User data" })
export class CreateUserInput implements Partial<User> {
  @Field()
  @MaxLength(64)
  email: string;

  @Field()
  @Length(8, 64)
  password: string;
}

@InputType({ description: "Update User data" })
export class UpdateUserInput implements Partial<User> {
  @Field()
  @MaxLength(64)
  email: string;

  @Field()
  @Length(8, 64)
  password: string;
}

@InputType({ description: "Login data" })
export class LoginInput implements Partial<User> {
  @Field()
  @MaxLength(64)
  email: string;

  @Field()
  @Length(4, 64)
  password: string;
}
