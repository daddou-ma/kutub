import React from "react";
import { Container, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { BasicLayout } from "Layouts/BasicLayout";
import logo from "../../public/img/logo.128.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    height: '100%',
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    margin: theme.spacing(6, 0, 6, 0),
    textAlign: "center",
  },
  information: {
    marginBottom: 32,
  },
  designedBy: {
    fontStyle: 'italic',
    textAlign: 'center'
  }
}));

export default function AboutPage(): React.ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <BasicLayout title={t("About")}>
      <Container className={classes.container}>
        <Box className={classes.logo}>
          <img src={logo} alt="logo" />
        </Box>
        <Typography className={classes.information}>
          Kutub is a Reading App
        </Typography>
        <Typography className={classes.designedBy}>
          Developed By<br /><b>Mohamed El Amine DADDOU</b>
        </Typography>
        <Typography className={classes.information}>
          Version 0.1.0
        </Typography>
      </Container>
    </BasicLayout>
  );
}
