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
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public filename: string;

  @Field()
  @Column("varchar", { length: 1024 })
  public filePath: string;

  @Field((type) => Book, { nullable: true })
  @ManyToOne(() => Book, (book) => book.epub)
  public book: Book;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.epubs)
  public owner: User;

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
}
