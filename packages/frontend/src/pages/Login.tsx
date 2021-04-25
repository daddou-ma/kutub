import React from "react";
import { Container, Box } from "@material-ui/core";

import { EmptyLayout } from "Layouts/EmptyLayout";
import { PasswordAuth } from "Components/PasswordAuth";
import { GoogleAuth } from "Components/GoogleAuth";
import { Copyright } from "Components/CopyRight";

export function LoginPage(): React.ReactElement {
  return (
    <EmptyLayout>
      <Container component="main" maxWidth="xs">
        <PasswordAuth />
        <GoogleAuth />
        <div></div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </EmptyLayout>
  );
}
