import * as Faker from "faker";
import { define } from "typeorm-seeding";
import Quote from "Entities/Quote.entity";

define(Quote, (faker: typeof Faker) => {
  const quote = new Quote();
  quote.content = faker.lorem.sentences();
  return quote;
});
