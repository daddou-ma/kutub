import { gql } from "@apollo/client";
import { Connection } from "Types/Connection";
import { Author } from "Types/Author";
import { Publisher } from "Types/Publisher";

export interface Book {
  id: string;
  isbn: string;
  title: string;
  description: string;
  publishDate: Date;
  coverPath: string;
  publisher: Publisher;
  authors: Connection<Author>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const BookFragment = gql`
  fragment BookFragment on Book {
    id
    isbn
    title
    description
    publishDate
    coverPath
    createdAt
    updatedAt
    deletedAt
  }
`;
