import gql from "graphql-tag";
import { Book } from "Types/Book";

export interface Publisher {
  id: string;
  name: string;
  books: Book[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const PublisherFragment = gql`
  fragment PublisherFragment on Publisher {
    id
    name
    createdAt
    updatedAt
    deletedAt
  }
`;
