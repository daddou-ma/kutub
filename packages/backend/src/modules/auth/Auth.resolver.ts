import { Resolver, Query, Mutation, Ctx, Args, Arg, Authorized } from "type-graphql";
import User from "Modules/users/User.entity";
import { PasswordAuthArguments } from "Modules/auth/args/PasswordAuthArgs";
import { GoogleAuthArguments } from "Modules/auth/args/GoogleAuthArgs";
import { UserInputError } from "apollo-server";
import Context from "Interfaces/Context";
import GoogleAuth from "Modules/auth/utils/GoogleAuth";
import { AuthResponse } from "./types/AuthResponse";
import { CreateUserInput } from "Modules/users/User.inputs";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import md5 from "md5";

@Resolver(() => AuthResponse)
export default class AuthResolver {
  @InjectRepository(User, "prod")
  private readonly repository!: Repository<User>;

  private googleOauth = new GoogleAuth(
    process.env.GAPI_CLIENT_ID,
    process.env.GAPI_CLIENT_SECRET,
    "postmessage"
  );

  @Authorized("USER")
  @Query(() => User, { nullable: true })
  async me(@Ctx() { user }: Context): Promise<User> {
    return user;
  }

  @Authorized("GUEST")
  @Mutation(() => AuthResponse)
  async register(
    @Arg("data") { name, email, password }: CreateUserInput
  ): Promise<AuthResponse> {
    let user;
    try {
      user = await this.repository.create({
        name,
        email,
        password: md5(password),
      });
      user = await this.repository.save(user);
    } catch (e) {
      throw new UserInputError("Invalid Informations");
    }

    return {
      user,
      token: user.generateJWT(),
    };
  }

  @Authorized("GUEST")
  @Mutation(() => AuthResponse)
  async passwordAuth(
    @Args() { username, password }: PasswordAuthArguments
  ): Promise<AuthResponse> {
    let user;
    try {
      user = await this.repository.findOneOrFail({
        where: {
          email: username,
          password: md5(password),
        },
      });
    } catch (e) {
      throw new UserInputError("Invalid Credentials");
    }

    return {
      user,
      token: user.generateJWT(),
    };
  }

  @Authorized("GUEST")
  @Mutation(() => AuthResponse)
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
