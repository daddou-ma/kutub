import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { useAuth } from "Hooks/useAuth";
import { useGoogleAuth } from "Hooks/useGoogleAuth";

import GoogleIcon from "../../public/icons/google-icon.svg";

const useStyles = makeStyles((theme) => ({
  google: {
    backgroundColor: "#DB4437",
    borderColor: "#DB4437",
    color: "white",
    margin: theme.spacing(3, 0, 2),
    "&:hover": {
      backgroundColor: "#DB4437",
      borderColor: "#DB4437",
      color: "white",
    },
    "&:active": {
      backgroundColor: "#DB4437",
      borderColor: "#DB4437",
      color: "white",
    },
    "&:focus": {
      backgroundColor: "#DB4437",
      borderColor: "#DB4437",
      color: "white",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
}));

export function GoogleAuth(): React.ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  const { connect } = useAuth();
  const { googleSignIn } = useGoogleAuth({
    onLoginSuccess: connect,
    onLoginFailure: console.log,
  });

  return (
    <Button
      variant="contained"
      className={classes.google}
      size="large"
      fullWidth
      onClick={() => googleSignIn()}
      startIcon={<GoogleIcon height={18} />}
    >
      {t("Connect with Google")}
    </Button>
  );
}
