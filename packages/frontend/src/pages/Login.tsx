import React from "react";
import { Container, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { EmptyLayout } from "Layouts/EmptyLayout";
import { PasswordAuth } from "Components/PasswordAuth";
import { GoogleAuth } from "Components/GoogleAuth";
import { Copyright } from "Components/CopyRight";
import logo from "../../public/img/logo.128.png";

const useStyles = makeStyles((theme) => ({
  logo: {
    margin: theme.spacing(8, 0, 3, 0),
    textAlign: "center",
  },
}));

export function LoginPage(): React.ReactElement {
  const classes = useStyles();

  return (
    <EmptyLayout>
      <Container component="main" maxWidth="xs">
        <Box className={classes.logo}>
          <img src={logo} alt="logo" />
        </Box>
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
