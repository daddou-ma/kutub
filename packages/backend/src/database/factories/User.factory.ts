import * as Faker from "faker";
import { define } from "typeorm-seeding";
import User from "Modules/users/User.entity";

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.name = faker.name.findName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  return user;
});
