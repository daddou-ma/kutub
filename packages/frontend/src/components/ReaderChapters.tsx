import React from "react";
import { useTranslation } from "react-i18next";
import {
  SwipeableDrawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { Book as BookIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 4,
      paddingBottom: 4,
    },
    icon: {
      width: 16,
    },
    text: {
      fontSize: "0.9em",
    },
  })
);

interface ReaderChaptersProps {
  chapters: any[];
  open: boolean;
  handleOpen: CallableFunction;
  handleClose: CallableFunction;
  handleChapterClick: CallableFunction;
}

export function ReaderChapters({
  chapters,
  open,
  handleOpen,
  handleClose,
  handleChapterClick,
}: ReaderChaptersProps): React.ReactElement {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleClick = (id) => {
    handleChapterClick(id);
    handleClose();
  };

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onOpen={() => handleOpen()}
      onClose={() => handleClose()}
    >
      <div style={{ width: 250 }} role="presentation">
        <List>
          {chapters.map(({ id, label, href }) => (
            <>
              <ListItem
                button
                onClick={() => handleClick(href)}
                key={id}
                className={styles.root}
              >
                <ListItemIcon>
                  <BookIcon className={styles.icon} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    className: styles.text,
                  }}
                />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </div>
    </SwipeableDrawer>
  );
}
