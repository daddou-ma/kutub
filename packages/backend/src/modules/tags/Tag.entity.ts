import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
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
export default class Tag extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public name: string;

  @ManyToMany(() => Book, (book) => book.tags)
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

  public static async findOrCreate(tag: Partial<Tag>): Promise<Tag> {
    const repository = getConnection("prod").getRepository(Tag);

    let instance = await repository.findOne({ name: tag.name });
    if (instance) return instance;
    instance = repository.create(tag);

    return repository.save(instance);
  }
}
