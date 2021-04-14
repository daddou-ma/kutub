import React from "react";
import { useHistory } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import {
  Home as HomeIcon,
  FormatQuote as FormatQuoteIcon,
  Favorite as FavoriteIcon,
  ChromeReaderMode as ChromeReaderModeIcon,
} from "@material-ui/icons";

export function CustomBottomNavigation(): React.ReactElement {
  const history = useHistory();
  function onChange(e, value: string) {
    history.push(value);
  }

  return (
    <BottomNavigation value="recents" onChange={onChange}>
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction
        label="Quotes"
        value="quotes"
        icon={<FormatQuoteIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Reader"
        value="reader"
        icon={<ChromeReaderModeIcon />}
      />
    </BottomNavigation>
  );
}
