import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Checkbox,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import { BasicLayout } from "Layouts/BasicLayout";
import { ME_QUERY } from "Graph/queries/auth";
import {
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

export default function FavoriteQuotesPage(): React.ReactElement {
  const { loading, error, data, fetchMore } = useQuery(ME_QUERY);
  const [favoriteQuote] = useMutation(FAVORITE_QUOTE_MUTATION, {
    onCompleted: console.error,
  });

  const [unFavoriteQuote] = useMutation(UNFAVORITE_QUOTE_MUTATION, {
    onCompleted: console.error,
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
    <BasicLayout title="Favorite" loading={loading} error={!data && error}>
      <List>
        {data.me.favoriteQuotes.map((quote) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="../../public/img/einstein.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={quote.content}
                secondary={
                  <React.Fragment>{`--${
                    quote?.author?.name || "ha"
                  }`}</React.Fragment>
                }
              />
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                name="checkedH"
                checked={quote.favorited}
                onChange={(e) => handleFavoriteChange(e, quote.id)}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </BasicLayout>
  );
}
