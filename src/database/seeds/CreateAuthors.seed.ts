import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import Author from "Modules/authors/Author.entity";
import authors from "Database/data/authors.json";

export default class CreateAuthors implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Author)
      .values(authors)
      .execute();
  }
}
