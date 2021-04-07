import * as React from "react";
import { useQuery } from "@apollo/client";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Checkbox,
  CircularProgress,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import VisibilitySensor from "react-visibility-sensor";

import { BasicLayout } from "Layouts/BasicLayout";
import { QUOTES_QUERY } from "Graph/queries/quotes";

export interface Quote {
  content: string;
  author: Author;
}

export interface Author {
  name: string;
}

export function QuotePage(): React.ReactElement {
  const { loading, error, data, fetchMore } = useQuery(QUOTES_QUERY);

  if (loading) return <>Loading...</>;
  if (error) return <>Error! {error.message}</>;

  return (
    <BasicLayout>
      <List>
        {data.quotes.edges.map(({ node }) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="../../public/img/einstein.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={node.content}
                secondary={
                  <React.Fragment>{`--${node.author.name}`}</React.Fragment>
                }
              />
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name="checkedH"
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
        <ListItem
          alignItems="flex-start"
          style={{
            justifyContent: "center",
            padding: 24,
          }}
        >
          {data.quotes.pageInfo.hasNextPage && (
            <VisibilitySensor
              onChange={(isVisible) => {
                if (isVisible) {
                  fetchMore({
                    variables: {
                      cursor: data.quotes.pageInfo.endCursor,
                    },
                  });
                }
              }}
            >
              {({ isVisible }) => {
                return (
                  <div>
                    {isVisible ? (
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        size={32}
                        thickness={4}
                      />
                    ) : (
                      "Loading"
                    )}
                  </div>
                );
              }}
            </VisibilitySensor>
          )}
        </ListItem>
      </List>
    </BasicLayout>
  );
}
