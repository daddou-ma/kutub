import * as React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
} from "@material-ui/core";
import { BasicLayout } from "Layouts/BasicLayout";
import { useTheme } from "Hooks/useTheme";

export function SettingsPage(): React.ReactElement {
  const { t } = useTranslation();
  const history = useHistory();
  const { darkMode, setDarkMode } = useTheme();

  return (
    <BasicLayout title={t("Settings")}>
      <List>
        <ListItem onClick={() => history.push("/settings/language")}>
          <ListItemText>{t("Language")}</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>{t("Dark Mode")}</ListItemText>
          <ListItemSecondaryAction>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </BasicLayout>
  );
}
