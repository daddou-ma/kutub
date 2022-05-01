import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class GoogleAuthArguments {
  @Field({ description: "Google Oauth2" })
  code?: string;
}
