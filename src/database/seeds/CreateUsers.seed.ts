import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import User from "Entities/User.entity";

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(User)().createMany(10);
  }
}
