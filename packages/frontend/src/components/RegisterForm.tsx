import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import { useAuth } from "Hooks/useAuth";
import { REGISTER_MUTATION } from "Graph/queries/auth";

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
}));

interface RegisterFormProps {
  onSwitch: CallableFunction;
}

export function RegisterForm({
  onSwitch,
}: RegisterFormProps): React.ReactElement {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const classes = useStyles();
  const { t } = useTranslation();

  const { connect } = useAuth();

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: ({ register }) =>
      connect({ user: register?.user, token: register?.token }),
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
    register({ variables: { data: form } });
  }

  return (
    <Box className={classes.paper}>
      <Typography component="h1" variant="h5">
        {t("Register")}
      </Typography>
      <Snackbar
        open={error}
        onClose={() => setError(null)}
        autoHideDuration={3000}
        message={error}
        key="register-message"
      />
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label={t("Full Name")}
          name="name"
          value={form.name}
          autoComplete="name"
          autoFocus
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label={t("Email Address")}
          name="email"
          value={form.email}
          autoComplete="email"
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
        <Button
          type="submit"
          variant="outlined"
          color="default"
          size="large"
          fullWidth
          className={classes.submit}
        >
          {t("Register")}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              {t("Forgot password?")}
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" onClick={() => onSwitch()}>
              {t("Already have an account? Login")}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
