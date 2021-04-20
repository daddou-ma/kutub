export interface GoogleTokens {
  tokens: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
  };
}
