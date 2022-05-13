import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
  makeStyles,
  createStyles,
  Typography,
} from "@material-ui/core";

import { Lecture } from "Types/index";
import { getCacheStorageObjectUrl } from "Utils/File";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      height:128,
      width:90,
      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.75) 100%)',
      margin:'auto',
      marginRight: 8,
      borderRadius: 4,
      overflow: 'hidden',
      '& img': {
        width: '100%'
      }
    },
    listItem: {
      color: theme.palette.text.primary,
      fontWeight: "bold",
      textDecoration: "none",
    },
  })
);

interface LibraryItemProps {
  lecture: Lecture;
}

export function LibraryItem({ lecture }: LibraryItemProps): React.ReactElement {
  const [coverUrl, setCoverUrl] = useState(null)
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    async function loadFunction() {
      setCoverUrl(await getCacheStorageObjectUrl('cached-covers', lecture?.coverPath))
    }
    loadFunction()
  }, [lecture?.coverPath])

  return (
    <>
      <ListItem alignItems="flex-start" key={lecture?.id}>
        <ListItemAvatar className={classes.avatar}>
          <img
            src={coverUrl}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link to={`/reader/${lecture?.id}`} className={classes.listItem}>
              {lecture?.metadata?.title.slice(0, 48)}
            </Link>
          }
          secondary={
            <React.Fragment>{`${t("by")} ${[lecture?.metadata?.author].map(
              (name) => name
            )}`}</React.Fragment>
          }
        />
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          style={{ padding: "8px 0 0 8px" }}
        >{`${Math.round(lecture.progress)}%`}</Typography>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
