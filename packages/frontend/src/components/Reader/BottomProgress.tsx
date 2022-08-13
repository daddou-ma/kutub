import React from "react";
import {
  Box,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  LinearProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    bar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    caption: {
      color: "#555",
      fontSize: '0.8rem',
      fontStyle: 'italic',
    },
  })
);

interface BottomProgressProps {
  progress: number;
  chapter: string;
}

export function BottomProgress({
  progress = 0,
  chapter,
}: BottomProgressProps): React.ReactElement {

  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Box className={classes.bar}>
        <Typography className={classes.caption}>{chapter}</Typography>
        <Typography className={classes.caption}>{`${progress}%`}</Typography>
      </Box>

      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
}
