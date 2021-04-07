import axios from "axios";
import { google } from "googleapis";
import Context from "Interfaces/Context";
import User from "Modules/users/User.entity";
import { GoogleUser } from "Modules/auth/interfaces/GoogleUser";
import { GoogleTokens } from "Modules/auth/interfaces/GoogleTokens";

export default class GoogleAuth {
  public oauth2Client;

  constructor(clientId, clientSecret, redirectURL) {
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectURL
    );
  }

  public getGoogleAuthURL(): string {
    /*
     * Generate a url that asks permissions to the user's email and profile
     */
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes, // If you only need one scope you can pass it as string
    });
  }

  public async getGoogleUser({ code }): Promise<GoogleUser> {
    console.log(code);
    const { tokens } = (await this.oauth2Client.getToken(code)) as GoogleTokens;

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(error.message);
      });

    return googleUser;
  }

  public async googleAuth({ code }, { db }: Context): Promise<User> {
    const googleUser = await this.getGoogleUser({ code });

    let user = await db
      .getRepository(User)
      .findOne({ googleId: String(googleUser.id) });

    if (user) {
      // Update their profile
      db.manager.update(User, user.id, {
        name: googleUser.name,
        email: googleUser.email,
      });
    }

    if (!user) {
      // Create the user in the database
      user = db.manager.create(User, {
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.id,
      });
      await db.manager.save(user);
    }

    // Generate a JWT, add it as a cookie

    return user;
  }
}
