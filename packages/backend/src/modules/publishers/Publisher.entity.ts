import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  getConnection,
} from "typeorm";
import { Node } from "Relay/interfaces/Node";
import Book from "Modules/books/Book.entity";

@Entity()
@ObjectType({ implements: Node })
export default class Publisher extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public name: string;

  @OneToMany(() => Book, (book) => book.publisher)
  @JoinTable()
  public books: Book[];

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  public deletedAt: Date;

  public static async findOrCreate(
    publisher: Partial<Publisher>
  ): Promise<Publisher> {
    const repository = getConnection("prod").getRepository(Publisher);

    let instance = await repository.findOne({ name: publisher.name });
    if (instance) return instance;
    instance = repository.create(publisher);

    return repository.save(instance);
  }
}
