import { gql } from "@apollo/client";

export abstract class Metadata {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  language: string;
  publisher: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const MetadataFragment = gql`
  fragment MetadataFragment on Metadata {
    id
    title
    author
    description
    isbn
    language
    publisher
    publishedAt
    createdAt
    updatedAt
    deletedAt
  }
`;
