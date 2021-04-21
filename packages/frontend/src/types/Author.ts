import gql from "graphql-tag";
import { Book } from "Types/Book";

export interface Author {
  id: string;
  name: string;
  books: Book[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const AuthorFragment = gql`
  fragment AuthorFragment on Author {
    id
    name
    createdAt
    updatedAt
    deletedAt
  }
`;
