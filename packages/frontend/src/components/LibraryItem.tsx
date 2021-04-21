import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import { EPub } from "Types/index";

interface LibraryItemProps {
  epub: EPub;
}

export function LibraryItem({ epub }: LibraryItemProps): React.ReactElement {
  const { t } = useTranslation();
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
          <Link
            style={{
              color: "#333",
              fontWeight: "bold",
              textDecoration: "none",
            }}
            to={`/reader/${epub?.id}`}
          >
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
