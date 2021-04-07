import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import {
  Folder as FolderIcon,
  Restore as RestoreIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
} from "@material-ui/icons";

export function CustomBottomNavigation(): React.ReactElement {
  return (
    <BottomNavigation value="recents" onChange={console.log}>
      <BottomNavigationAction
        label="Recents"
        value="recents"
        icon={<RestoreIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<LocationOnIcon />}
      />
      <BottomNavigationAction
        label="Folder"
        value="folder"
        icon={<FolderIcon />}
      />
    </BottomNavigation>
  );
}
