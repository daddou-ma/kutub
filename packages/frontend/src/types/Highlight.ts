import gql from "graphql-tag";
import { EPub } from "Types/EPub";
import { User } from "Types/User";

export interface Highlight {
  id: string;
  content: string;
  cfiRange: string;
  epub: EPub;
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
