import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Radio,
} from "@material-ui/core";
import { BasicLayout } from "Layouts/BasicLayout";

export function LanguageSettingsPage(): React.ReactElement {
  const { t, i18n } = useTranslation();

  return (
    <BasicLayout title={t("Settings")}>
      <List>
        <ListItem>
          <ListItemText>{t("English")}</ListItemText>
          <ListItemSecondaryAction>
            <Radio
              checked={i18n.language === "en"}
              onChange={() => i18n.changeLanguage("en")}
              value="en"
              name="language"
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText>{t("Arabic")}</ListItemText>
          <ListItemSecondaryAction>
            <Radio
              checked={i18n.language === "ar"}
              onChange={() => i18n.changeLanguage("ar")}
              value="ar"
              name="language"
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </BasicLayout>
  );
}
