import * as React from "react";
import { useMutation } from "@apollo/client";

import { useAuth } from "../../hooks/useAuth";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

export function LoginPage(): React.ReactElement {
  const { connect, isConnected, user, token } = useAuth();
  const { googleSignIn, googleSignOut } = useGoogleAuth({
    onLoginSuccess: connect,
    onLoginFailure: console.log,
  });
  console.log(isConnected, token, user);
  return (
    <>
      <div onClick={() => googleSignIn()}>Login</div>
      <div onClick={() => googleSignOut()}>Logout</div>
    </>
  );
}
