import { gql } from "@apollo/client";

export const GOOGLE_AUTH_MUTATION = gql`
  mutation GOOGLE_AUTH($code: String!) {
    googleAuth(code: $code) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;
