import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
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
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
  Book as BookIcon,
  FormatQuote as FormatQuoteIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from "@material-ui/icons";
import { useAuth } from "Hooks/useAuth";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      boxShadow: "none",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

interface MenuAction {
  name: string;
  onClick: any;
}
interface TopBarProps {
  title: string;
  actions?: MenuAction[];
}

export function TopBar({ title, actions = [] }: TopBarProps) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { user } = useAuth();

  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (path) => {
    history.push(path);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => setOpenDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <SwipeableDrawer
            anchor="left"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
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
              </List>
            </div>
          </SwipeableDrawer>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              {actions.map(({ name, onClick }) => (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    onClick();
                  }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
