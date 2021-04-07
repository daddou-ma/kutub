import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import Quote from "Modules/quotes/Quote.entity";
import quotes from "Database/data/quotes.json";
import Author from "Modules/authors/Author.entity";

export default class CreateQuotes implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    for (const quote of quotes) {
      const createdQuote = await connection.manager.create(Quote, {
        content: quote.quote,
      });

      const author = await connection.manager.findOne(Author, {
        name: quote.author,
      });

      if (author) {
        createdQuote.author = author;
        connection.manager.save(Quote, createdQuote);
      }
    }
  }
}
