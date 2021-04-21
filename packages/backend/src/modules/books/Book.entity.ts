import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  getConnection,
  OneToMany,
} from "typeorm";
import Author from "Modules/authors/Author.entity";
import { Node } from "Relay/interfaces/Node";
import EPub from "Modules/epubs/EPub.entity";
import Publisher from "Modules/publishers/Publisher.entity";
@Entity()
@ObjectType({ implements: Node })
export default class Book extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field({ nullable: true })
  @Column("varchar", { length: 512 })
  public isbn: string;

  @Field()
  @Column("varchar", { length: 512 })
  public title: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true, length: 2048 })
  public description: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 1024 })
  public coverPath: string;

  @Field(() => Publisher, { nullable: true })
  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  public publisher: Publisher;

  @OneToMany(() => EPub, (epub) => epub.book)
  public epubs: EPub[];

  @ManyToMany(() => Author, (author) => author.books)
  public authors: Author[];

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn()
  public deletedAt: Date;

  @Field(() => Boolean)
  public favorited: boolean;

  public static async findOrCreate(book: Partial<Book>): Promise<Book> {
    const repository = getConnection("prod").getRepository(Book);

    let instance = await repository.findOne({ isbn: book.isbn });
    if (instance) return instance;
    instance = repository.create(book);

    return repository.save(instance);
  }
}
