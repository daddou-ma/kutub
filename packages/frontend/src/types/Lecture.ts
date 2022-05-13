import { gql } from "@apollo/client";
import { Connection } from "Types/Connection";
import { Highlight } from "Types/Highlight";
import { User } from "Types/User";
import { Metadata } from "Types/Metadata";

export abstract class Lecture {
  id: string;
  filename: string;
  filePath: string;
  coverPath: string;
  location: string;
  progress: number;
  metadata: Metadata;
  highlights: Connection<Highlight>;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const LectureFragment = gql`
  fragment LectureFragment on Lecture {
    id
    filename
    filePath
    coverPath
    location
    progress
    createdAt
    updatedAt
    deletedAt
  }
`;
