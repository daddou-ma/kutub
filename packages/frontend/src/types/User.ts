import gql from "graphql-tag";
import { Connection } from "Types/Connection";
import { EPub } from "Types/EPub";

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  epubs: Connection<EPub>;
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
    createdAt
    updatedAt
    deletedAt
  }
`;
