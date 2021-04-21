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
} from "typeorm";
import base64 from "base-64";
import Author from "Modules/authors/Author.entity";
import { Node } from "Relay/interfaces/Node";
import User from "Modules/users/User.entity";
@Entity()
@ObjectType({ implements: Node })
export default class Quote extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public content: string;

  @Field(() => ID)
  public authorId: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.quotes)
  public author: Author;

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

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.favoriteQuotes)
  public favoredBy: User[];

  @Field()
  public get hash(): string {
    return base64.encode(this.id.toString());
  }
}
