import React from "react";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <>
      <ListItem alignItems="flex-start" key={epub?.id}>
        <ListItemAvatar>
          <img
            width={48}
            alt={epub?.book?.title}
            src={`${process.env.URL}/${epub?.book?.coverPath}`}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link to={`/reader/${epub?.id}`} className={classes.listItem}>
              {epub?.book?.title.slice(0, 48)}
            </Link>
          }
          secondary={
            <React.Fragment>{`${t("by")} ${epub?.book?.authors.edges.map(
              ({ node }) => node.name
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
