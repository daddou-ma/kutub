import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query ME {
    me {
      id
      name
      email
      picture
      favoriteQuotes {
        id
        content
        favorited
        author {
          name
        }
      }
    }
  }
`;

export const GOOGLE_AUTH_MUTATION = gql`
  mutation GOOGLE_AUTH($code: String!) {
    googleAuth(code: $code) {
      user {
        id
        name
        email
        picture
      }
      token
    }
  }
`;
