import { gql } from "@apollo/client";

export const QUOTES_QUERY = gql`
  query QUOTES($cursor: String) {
    quotes(first: 25, after: $cursor) {
      edges {
        node {
          id
          content
          favorited
          author {
            name
          }
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasNextPage
      }
    }
  }
`;

export const FAVORITE_QUOTE_MUTATION = gql`
  mutation FAVORITE_QUOTE_MUTATION($quoteId: String!) {
    quote: favoriteQuote(quoteId: $quoteId) {
      id
      content
      favorited
      author {
        name
      }
    }
  }
`;

export const UNFAVORITE_QUOTE_MUTATION = gql`
  mutation UNFAVORITE_QUOTE_MUTATION($quoteId: String!) {
    quote: unFavoriteQuote(quoteId: $quoteId) {
      id
      content
      favorited
      author {
        name
      }
    }
  }
`;
