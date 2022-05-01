import React from "react";
import { Container, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { EmptyLayout } from "Layouts/EmptyLayout";
import logo from "../../public/img/logo.128.png";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    margin: theme.spacing(6, 0, 6, 0),
    textAlign: "center",
  },
}));

export default function AboutPage(): React.ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <EmptyLayout title={t("Login")}>
      <Container className={classes.container}>
        <Box className={classes.logo}>
          <img src={logo} alt="logo" />
        </Box>
        <CircularProgress />
      </Container>
    </EmptyLayout>
  );
}
