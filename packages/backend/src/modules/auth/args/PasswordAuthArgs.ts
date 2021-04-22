import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class PasswordAuthArguments {
  @Field({ description: "Username" })
  username: string;

  @Field({ description: "Password" })
  password: string;
}
