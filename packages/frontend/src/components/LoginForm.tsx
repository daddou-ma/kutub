import React from "react";
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { useAuth } from "Hooks/useAuth";
import { useGoogleAuth } from "Hooks/useGoogleAuth";

import GoogleIcon from "../../public/icons/google-icon.svg";
import FacebookIcon from "../../public/icons/facebook-icon.svg";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
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
  facebook: {
    backgroundColor: "#4267B2",
    borderColor: "#4267B2",
    color: "white",
    margin: theme.spacing(0, 0, 3),
    "&:hover": {
      backgroundColor: "#4267B2",
      borderColor: "#4267B2",
      color: "white",
    },
    "&:active": {
      backgroundColor: "#4267B2",
      borderColor: "#4267B2",
      color: "white",
    },
    "&:focus": {
      backgroundColor: "#4267B2",
      borderColor: "#4267B2",
      color: "white",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
}));

export function LoginForm(): React.ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  const { connect } = useAuth();
  const { googleSignIn } = useGoogleAuth({
    onLoginSuccess: connect,
    onLoginFailure: console.log,
  });

  return (
    <Box className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t("Sign in")}
      </Typography>
      <form className={classes.form} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label={t("Email Address")}
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("Password")}
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label={t("Remember me")}
        />
        <Button
          type="submit"
          variant="outlined"
          color="default"
          size="large"
          fullWidth
          className={classes.submit}
        >
          {t("Sign In")}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              {t("Forgot password?")}
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {t("Don't have an account? Sign Up")}
            </Link>
          </Grid>
        </Grid>
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
        <Button
          variant="contained"
          className={classes.facebook}
          size="large"
          fullWidth
          onClick={() => googleSignIn()}
          startIcon={<FacebookIcon height={18} />}
        >
          {t("Connect with Facebook")}
        </Button>
      </form>
    </Box>
  );
}
