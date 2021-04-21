import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import Book from "Modules/books/Book.entity";
import User from "Modules/users/User.entity";
import { Node } from "Relay/interfaces/Node";

@Entity()
@ObjectType({ implements: Node })
export default class EPub extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public filename: string;

  @Field()
  @Column("varchar", { length: 1024 })
  public filePath: string;

  @ManyToOne(() => Book, (book) => book.epubs)
  public book: Book;

  @ManyToOne(() => User, (user) => user.epubs)
  public createdBy?: User;

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date)
  @DeleteDateColumn()
  public deletedAt: Date;
}
