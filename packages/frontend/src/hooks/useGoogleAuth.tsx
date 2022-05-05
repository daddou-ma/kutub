import { useMutation } from "@apollo/client";
import { useGoogleLogin, useGoogleLogout } from "react-google-login";
import { GOOGLE_AUTH_MUTATION } from "Graph/queries/auth";

const CLIENT_ID =
  process.env.GAPI_CLIENT_ID;
const ACCESS_TYPE = "offline";
const RESPONSE_TYPE = "code";

interface GoogleAuthHookReturn {
  googleSignIn: CallableFunction;
  googleSignOut: CallableFunction;
}

interface GoogleAuthHookProps {
  onLoginSuccess?: CallableFunction;
  onLoginFailure?: CallableFunction;
  onLogoutSuccess?: CallableFunction;
  onLogoutFailure?: CallableFunction;
}

export function useGoogleAuth({
  onLoginSuccess = () => {},
  onLoginFailure = () => {},
  onLogoutSuccess = () => {},
  onLogoutFailure = () => {},
}: GoogleAuthHookProps): GoogleAuthHookReturn {
  const [googleAuth] = useMutation(GOOGLE_AUTH_MUTATION, {
    onCompleted: ({ googleAuth }) =>
      onLoginSuccess({ user: googleAuth?.user, token: googleAuth?.token }),
  });

  const { signIn: googleSignIn } = useGoogleLogin({
    clientId: CLIENT_ID,
    accessType: ACCESS_TYPE,
    responseType: RESPONSE_TYPE,
    onSuccess: ({ code }) => googleAuth({ variables: { code } }),
    onFailure: (err) => onLoginFailure(err),
  });

  const { signOut: googleSignOut } = useGoogleLogout({
    clientId: CLIENT_ID,
    accessType: ACCESS_TYPE,
    onLogoutSuccess: () => onLogoutSuccess(),
    onFailure: () => {
      onLogoutFailure();
    },
  });

  return {
    googleSignIn,
    googleSignOut,
  };
}
