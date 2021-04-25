import React from "react";
import { Typography, Link } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export function Copyright(): React.ReactElement {
  const { t } = useTranslation();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {t("Copyright © ")}
      <Link color="inherit" href="https://material-ui.com/">
        Inspire.io
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
