import { gql } from "@apollo/client";
import { Connection } from "Types/Connection";
import { Lecture } from "Types/Lecture";

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  lectures: Connection<Lecture>;
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
