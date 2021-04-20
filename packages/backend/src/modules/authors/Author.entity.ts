import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  getConnection,
} from "typeorm";
import Quote from "Modules/quotes/Quote.entity";
import Book from "Modules/books/Book.entity";

@ObjectType()
@Entity()
export default class Author {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public name: string;

  @Field((type) => [Book])
  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable()
  public books: Book[];

  @Field((type) => [Quote])
  @OneToMany(() => Quote, (quote) => quote.author)
  public quotes: Quote[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  public static async findOrCreate(author: Partial<Author>): Promise<Author> {
    const repository = getConnection("prod").getRepository(Author);

    let instance = await repository.findOne({ name: author.name });
    if (instance) return instance;
    instance = repository.create(author);

    return repository.save(instance);
  }
}
