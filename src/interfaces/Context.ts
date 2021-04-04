import { Connection, Repository } from "typeorm";

import { Node } from "Relay/interfaces/Node";

export default interface Context {
  db: Connection;
  repositories: Record<string, Repository<Node>>;
}
