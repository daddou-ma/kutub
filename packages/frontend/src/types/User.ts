import gql from "graphql-tag";
import { EPub } from "Types/EPub";

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  epubs: EPub[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    name
    email
    picture
    filePath
    createdAt
    updatedAt
    deletedAt
  }
`;
