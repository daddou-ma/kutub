import { Connection } from "typeorm";

export default interface Context {
  db: Connection;
}
