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
import { Node } from "Relay/interfaces/Node";
import Quote from "Modules/quotes/Quote.entity";
import Book from "Modules/books/Book.entity";

@Entity()
@ObjectType({ implements: Node })
export default class Author extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public name: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable()
  public books: Book[];

  @OneToMany(() => Quote, (quote) => quote.author)
  public quotes: Quote[];

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date, { nullable: true })
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
