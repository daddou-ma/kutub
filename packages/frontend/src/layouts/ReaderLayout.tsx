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
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import {
  ArrowBack as ArrowBackIcon,
  Bookmark as BookmarkIcon,
  TextFormat as TextFormatIcon,
  Toc as TocIcon
} from "@material-ui/icons";

import { ReaderChapters } from "Components/ReaderChapters";
import { BottomProgress } from "Components/Reader/BottomProgress";
import { useReaderSettings } from "Hooks/useReaderSettings";
import TypographySettings from "Components/Reader/TypographySettings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      boxShadow: "none",
    },
    top: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      position: 'fixed',
      inset: '0 0 auto 0',
      height: 57,
      boxShadow: '0 0 8px 0 #00000017',
      borderBottom: '1px solid #CCCCCC',
      zIndex: 11,
    },
    bottom: {
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
      position: 'fixed',
      inset: 'auto 0 0 0',
      boxShadow: '0 0 8px 0 #00000017',
      borderTop: '1px solid #CCCCCC',
      zIndex: 11,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    content: {
      flexBasis: "auto",
      height: "100%",
      overflow: "scroll",
      position: "relative",
    },
    contentBlured: {
      flexBasis: "auto",
      height: "100%",
      overflow: "scroll",
      position: "relative",
      filter: 'contrast(0.5) blur(2px)',
    }
  })
);

interface ReaderLayoutProps {
  title: string;
  loading?: boolean;
  error?: any;
  progress: number;
  currentChapter: string;
  chapters: any[];
  handleChapterClick: CallableFunction;
  showOptions: boolean;
  children: React.ReactElement | React.ReactElement[];
}

export function ReaderLayout({
  title = "Book Title",
  loading = false,
  error,
  progress = 0,
  chapters = [],
  currentChapter,
  handleChapterClick,
  showOptions,
  children,
}: ReaderLayoutProps): React.ReactElement {
  const [openDrawer, setOpenDrawer] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const { theme, setFont, setFontSize } = useReaderSettings()

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box display="flex" flexDirection="column" width="100vw" height="100vh">
        {showOptions && <Box className={classes.top}>
          <AppBar position="fixed" className={classes.root}>
            <Toolbar>
             <IconButton
                edge="start"
                color="inherit"
                className={classes.menuButton}
                aria-label="back"
                onClick={() => history.goBack()}
              >
                <ArrowBackIcon />
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
                <TextFormatIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="back"
                onClick={() => history.goBack()}
              >
                <BookmarkIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={() => setOpenDrawer(true)}
              >
                <TocIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>}
        <Box
          flexBasis="auto"
          height="100%"
          overflow="scroll"
          position="relative"
          className={showOptions ? classes.contentBlured : classes.content}
        >
          {loading ? "Lodaing" : error ? "error" : children}
        </Box>

        <BottomProgress progress={progress} chapter={currentChapter} />
        {showOptions && <Box className={classes.bottom}>
          <TypographySettings
            theme={theme}
            onFontChange={setFont}
            onFontSizeChange={setFontSize}
          />
          </Box>}
      </Box>
    </>
  );
}
