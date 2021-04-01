import * as Faker from "faker";
import { define } from "typeorm-seeding";
import Author from "Entities/Author.entity";

define(Author, (faker: typeof Faker) => {
  const author = new Author();
  author.name = faker.name.findName();
  return author;
});
