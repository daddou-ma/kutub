import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  Typography,
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
} from "@material-ui/core";
import {
  Book as BookIcon,
  FormatQuote as FormatQuoteIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";
import { useAuth } from "Hooks/useAuth";

interface SideMenuProps {
  open: boolean;
  handleOpen: CallableFunction;
  handleClose: CallableFunction;
}

export function SideMenu({
  open,
  handleOpen,
  handleClose,
}: SideMenuProps): React.ReactElement {
  const history = useHistory();
  const { t } = useTranslation();
  const { user, disconnect } = useAuth();

  const handleClick = (path) => {
    history.push(path);
    handleClose();
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={() => handleOpen()}
      onClose={() => handleClose()}
    >
      <div style={{ width: 250 }} role="presentation">
        <Box p={2}>
          <Avatar alt={user?.name} src={user?.picture} />
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="overline">{user?.email}</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={() => handleClick("/library")}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary={t("My Library")} />
          </ListItem>
          <ListItem button onClick={() => handleClick("/quotes")}>
            <ListItemIcon>
              <FormatQuoteIcon />
            </ListItemIcon>
            <ListItemText primary={t("Quotes")} />
          </ListItem>
          <ListItem button onClick={() => handleClick("/settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t("Settings")} />
          </ListItem>
          <ListItem button onClick={() => handleClick("/about")}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={t("About")} />
          </ListItem>
          <ListItem button onClick={() => disconnect()}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={t("Logout")} />
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  );
}
