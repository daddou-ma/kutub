import gql from "graphql-tag";
import { Author } from "Types/Author";

export interface Quote {
  id: string;
  content: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const QuoteFragment = gql`
  fragment QuoteFragment on Quote {
    id
    content
    createdAt
    updatedAt
    deletedAt
  }
`;
