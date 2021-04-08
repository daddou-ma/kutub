import * as React from "react";
import { Button, Container, Box } from "@material-ui/core";
// import { Google } from "@material-ui/icons";

import { useAuth } from "Hooks/useAuth";
import { useGoogleAuth } from "Hooks/useGoogleAuth";
import { EmptyLayout } from "Layouts/EmptyLayout";
import { LoginForm } from "Components/LoginForm";
import { Copyright } from "Components/CopyRight";
import GoogleIcon from "../../public/icons/google-icon.svg";

export function LoginPage(): React.ReactElement {
  const { connect } = useAuth();
  const { googleSignIn } = useGoogleAuth({
    onLoginSuccess: connect,
    onLoginFailure: console.log,
  });

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="xs">
        <LoginForm />
        <div></div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </EmptyLayout>
  );
}
