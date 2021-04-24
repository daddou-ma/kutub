import gql from "graphql-tag";
import { Connection } from "Types/Connection";
import { Book } from "Types/Book";
import { Highlight } from "Types/Highlight";
import { User } from "Types/User";

export abstract class EPub {
  id: string;
  filename: string;
  filePath: string;
  location: string;
  progress: number;
  book: Book;
  highlights: Connection<Highlight>;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const EPubFragment = gql`
  fragment EPubFragment on EPub {
    id
    filename
    filePath
    location
    progress
    createdAt
    updatedAt
    deletedAt
  }
`;
