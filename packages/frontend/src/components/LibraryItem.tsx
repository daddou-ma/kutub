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

import { EPub } from "Types/index";
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
  epub: EPub;
}

export function LibraryItem({ epub }: LibraryItemProps): React.ReactElement {
  const [coverUrl, setCoverUrl] = useState(null)
  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    async function loadFunction() {
      setCoverUrl(await getCacheStorageObjectUrl('cached-covers', epub?.coverPath))
    }
    loadFunction()
  }, [epub?.coverPath])

  return (
    <>
      <ListItem alignItems="flex-start" key={epub?.id}>
        <ListItemAvatar className={classes.avatar}>
          <img
            src={coverUrl}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link to={`/reader/${epub?.id}`} className={classes.listItem}>
              {epub?.metadata?.title.slice(0, 48)}
            </Link>
          }
          secondary={
            <React.Fragment>{`${t("by")} ${[epub?.metadata?.author].map(
              (name) => name
            )}`}</React.Fragment>
          }
        />
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
          style={{ padding: "8px 0 0 8px" }}
        >{`${Math.round(epub.progress)}%`}</Typography>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
