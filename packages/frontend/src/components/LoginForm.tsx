import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { useAuth } from "Hooks/useAuth";
import { PASSWORD_AUTH_MUTATION } from "Graph/queries/auth";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
}));

interface LoginFormProps {
  onSwitch: CallableFunction;
}

export function LoginForm({ onSwitch }: LoginFormProps): React.ReactElement {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();

  const { connect } = useAuth();

  const [passwordAuth] = useMutation(PASSWORD_AUTH_MUTATION, {
    onCompleted: ({ passwordAuth }) =>
      connect({ user: passwordAuth?.user, token: passwordAuth?.token }),
    onError: () => setError(t("Invalid Credentials")),
  });

  function handleChange({ target: { name, value } }) {
    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    passwordAuth({ variables: form });
  }

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5">
        {t("Sign in")}
      </Typography>
      <Snackbar
        open={error}
        onClose={() => setError(null)}
        autoHideDuration={3000}
        message={error}
        key="login-message"
      />
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label={t("Email Address")}
          name="username"
          value={form.username}
          autoComplete="email"
          autoFocus
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          value={form.password}
          label={t("Password")}
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={handleChange}
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
            <Link href="#" variant="body2" onClick={() => onSwitch()}>
              {t("Don't have an account? Sign Up")}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
