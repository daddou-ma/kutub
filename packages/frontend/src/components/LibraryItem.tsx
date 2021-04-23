import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
  Theme,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

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
    <ListItem alignItems="flex-start" key={epub?.id}>
      <ListItemAvatar>
        <img
          width={48}
          alt={epub?.book?.title}
          src={"http://localhost:4000/" + epub?.book?.coverPath}
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
      <Checkbox
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite />}
        checked={false}
        onChange={(e) => console.log(e, epub.id)}
      />
    </ListItem>
  );
}
