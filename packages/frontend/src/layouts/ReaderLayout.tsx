import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  IconButton,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  AppBar,
  Toolbar,
  LinearProgress,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import {
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";

import { ReaderChapters } from "Components/ReaderChapters";

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

interface ReaderLayoutProps {
  title: string;
  loading?: boolean;
  error?: any;
  progress: number;
  chapters: any[];
  handleChapterClick: CallableFunction;
  children: React.ReactElement | React.ReactElement[];
}

export function ReaderLayout({
  title = "Book Title",
  loading = false,
  error,
  progress = 0,
  chapters = [],
  handleChapterClick,
  children,
}: ReaderLayoutProps): React.ReactElement {
  const [openDrawer, setOpenDrawer] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box display="flex" flexDirection="column" width="100vw" height="100vh">
        <Box flexBasis={64}>
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
              <Typography variant="body1" className={classes.title}>
                {`${title.slice(0, 24)}...`}
              </Typography>
              <ReaderChapters
                open={openDrawer}
                chapters={chapters}
                handleOpen={() => setOpenDrawer(true)}
                handleClose={() => setOpenDrawer(false)}
                handleChapterClick={handleChapterClick}
              />
              <IconButton
                color="inherit"
                aria-label="back"
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <Box
          flexBasis="auto"
          height="100%"
          overflow="scroll"
          position="relative"
        >
          {loading ? "Lodaing" : error ? "error" : children}
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
    </>
  );
}
