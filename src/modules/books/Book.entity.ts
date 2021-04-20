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
} from "typeorm";
import Author from "Modules/authors/Author.entity";
import User from "Modules/users/User.entity";
import { Node } from "Relay/interfaces/Node";
import EPub from "Modules/epubs/EPub.entity";

@Entity()
@ObjectType({ implements: Node })
export default class Book extends Node {
  @Field((type) => ID)
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
  @Column("varchar", { nullable: true, length: 512 })
  public publisher: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 1024 })
  public coverPath: string;

  @Field((type) => EPub)
  @ManyToOne(() => EPub, (epub) => epub.book)
  public epub: EPub;

  @Field((type) => [Author])
  @ManyToMany(() => Author, (author) => author.books)
  public authors: Author[];

  @Field((type) => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field((type) => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field((type) => Date)
  @DeleteDateColumn()
  public deletedAt: Date;

  @Field((type) => Boolean)
  public favorited: boolean;

  public static async findOrCreate(book: Partial<Book>): Promise<Book> {
    const repository = getConnection("prod").getRepository(Book);

    let instance = await repository.findOne({ isbn: book.isbn });
    if (instance) return instance;
    instance = repository.create(book);

    return repository.save(instance);
  }
}
