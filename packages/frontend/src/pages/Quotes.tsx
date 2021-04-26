import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
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
import {
  QUOTES_QUERY,
  FAVORITE_QUOTE_MUTATION,
  UNFAVORITE_QUOTE_MUTATION,
} from "Graph/queries/quotes";

export interface Quote {
  content: string;
  author: Author;
}

export interface Author {
  name: string;
}

export function QuotePage(): React.ReactElement {
  const { t } = useTranslation();
  const { loading, error, data, fetchMore } = useQuery(QUOTES_QUERY);
  const [favoriteQuote] = useMutation(FAVORITE_QUOTE_MUTATION, {
    onCompleted: console.log,
  });

  const [unFavoriteQuote] = useMutation(UNFAVORITE_QUOTE_MUTATION, {
    onCompleted: console.log,
  });

  function handleCacheUpdate(cache, { data: { quote } }) {
    cache.modify({
      fields: {
        quotes({ existingQuotes }) {
          cache.writeFragment({
            id: `Quote:${quote.id}`,
            fragment: gql`
              fragment QuoteFavorited on Quote {
                favorited
              }
            `,
            data: quote,
          });
          return existingQuotes;
        },
      },
    });
  }

  const handleFavoriteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    quoteId
  ) => {
    if (event.target.checked) {
      favoriteQuote({
        variables: { quoteId },
        update: handleCacheUpdate,
      });
    } else {
      unFavoriteQuote({
        variables: { quoteId },
        update: handleCacheUpdate,
      });
    }
  };

  return (
    <BasicLayout
      title={t("My Quotes")}
      loading={loading}
      error={!data && error}
    >
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
                checked={node.favorited}
                onChange={(e) => handleFavoriteChange(e, node.id)}
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
