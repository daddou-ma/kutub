import { EntityManager } from "typeorm";

export default interface Context {
  manager: EntityManager;
}
