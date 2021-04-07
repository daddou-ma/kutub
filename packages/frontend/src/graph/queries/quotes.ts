import { gql } from "@apollo/client";

export const QUOTES_QUERY = gql`
  query QUOTES($cursor: String) {
    quotes(first: 25, after: $cursor) {
      edges {
        node {
          id
          content
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
