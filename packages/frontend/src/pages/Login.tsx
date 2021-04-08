import * as React from "react";
import { Container, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import { EmptyLayout } from "Layouts/EmptyLayout";
import { LoginForm } from "Components/LoginForm";
import { Copyright } from "Components/CopyRight";

export function LoginPage(): React.ReactElement {
  const { t } = useTranslation();
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
