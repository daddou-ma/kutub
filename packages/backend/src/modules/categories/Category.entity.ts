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
export default class Category extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public name: string;

  @OneToMany(() => Book, (book) => book.category)
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
    category: Partial<Category>
  ): Promise<Category> {
    const repository = getConnection("prod").getRepository(Category);

    let instance = await repository.findOne({ name: category.name });
    if (instance) return instance;
    instance = repository.create(category);

    return repository.save(instance);
  }
}
