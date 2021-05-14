import React from "react";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
} from "@material-ui/core";
import { BasicLayout } from "Layouts/BasicLayout";

export default function LanguageSettingsPage(): React.ReactElement {
  const { t, i18n } = useTranslation();

  return (
    <BasicLayout title={t("Settings")}>
      <List>
        <ListItem onClick={() => i18n.changeLanguage("en")}>
          <ListItemText>{t("English")}</ListItemText>
          <ListItemSecondaryAction>
            <Radio
              checked={i18n.language === "en"}
              value="en"
              name="language"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem onClick={() => i18n.changeLanguage("ar")}>
          <ListItemText>{t("Arabic")}</ListItemText>
          <ListItemSecondaryAction>
            <Radio
              checked={i18n.language === "ar"}
              value="ar"
              name="language"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </BasicLayout>
  );
}
