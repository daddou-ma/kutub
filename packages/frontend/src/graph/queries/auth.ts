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

export const REGISTER_MUTATION = gql`
  mutation REGISTER($data: CreateUserInput!) {
    register(data: $data) {
      user {
        ...UserFragment
      }
      token
    }
  }
  ${UserFragment}
`;

export const PASSWORD_AUTH_MUTATION = gql`
  mutation PASSWORD_AUTH($username: String!, $password: String!) {
    passwordAuth(username: $username, password: $password) {
      user {
        ...UserFragment
      }
      token
    }
  }
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
