import * as React from "react";

import { useAuth } from "Hooks/useAuth";
import { useGoogleAuth } from "Hooks/useGoogleAuth";
import { EmptyLayout } from "Layouts/EmptyLayout";

export function LoginPage(): React.ReactElement {
  const { connect } = useAuth();
  const { googleSignIn } = useGoogleAuth({
    onLoginSuccess: connect,
    onLoginFailure: console.log,
  });

  return (
    <EmptyLayout>
      <div>
        <div onClick={() => googleSignIn()}>Login</div>
      </div>
    </EmptyLayout>
  );
}
