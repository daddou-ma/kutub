import { Resolver, Query, Mutation, Ctx, Args } from "type-graphql";
import User from "Modules/users/User.entity";
import { GoogleAuthArguments } from "Modules/auth/args/GoogleAuthArgs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import GoogleAuth from "Modules/auth/utils/GoogleAuth";
import { AuthResponse } from "./types/AuthResponse";

@Resolver((of) => AuthResponse)
export default class AuthResolver {
  private googleOauth = new GoogleAuth(
    "510638141141-obpsl73plm75hjvfqnaaaegg3o4bqfc5.apps.googleusercontent.com",
    "O3PjAWdPkK6d-K9HEmEATfeu",
    "postmessage"
  );
  @Mutation((returns) => AuthResponse)
  async googleAuth(
    @Args() { code }: GoogleAuthArguments,
    @Ctx() context: Context
  ): Promise<AuthResponse> {
    const user = await this.googleOauth.googleAuth({ code }, context);

    return {
      user,
      token: user.generateJWT(),
    };
  }
}
