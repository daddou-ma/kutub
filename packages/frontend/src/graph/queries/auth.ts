import { gql } from "@apollo/client";
import { AuthorFragment } from "Types/Author";
import { UserFragment } from "Types/User";
import { QuoteFragment } from "Types/Quote";

export const ME_QUERY = gql`
  query ME {
    me {
      ...UserFragment
      favoriteQuotes {
        edges {
          node {
            ...QuoteFragment
            author {
              ...AuthorFragment
            }
          }
          cursor
        }
        totalCount
      }
    }
  }
  ${AuthorFragment}
  ${QuoteFragment}
  ${UserFragment}
`;

export const GOOGLE_AUTH_MUTATION = gql`
  mutation GOOGLE_AUTH($code: String!) {
    googleAuth(code: $code) {
      user {
        ...UserFragment
      }
      token
    }
  }
  ${UserFragment}
`;
