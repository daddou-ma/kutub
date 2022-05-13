import { gql } from "@apollo/client";
import { Lecture } from "Types/Lecture";
import { User } from "Types/User";

export interface Highlight {
  id: string;
  content: string;
  cfiRange: string;
  lecture: Lecture;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const HighlightFragment = gql`
  fragment HighlightFragment on Highlight {
    id
    content
    cfiRange
    createdAt
    updatedAt
    deletedAt
  }
`;
