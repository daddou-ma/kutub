import { Connection, Repository } from "typeorm";
import User from "Modules/users/User.entity";
import Device from "Modules/devices/Device.entity";
import { Node } from "Relay/interfaces/Node";

export default interface Context {
  db: Connection;
  repositories: Record<string, Repository<Node>>;
  user?: User;
  device?: Device;
}
