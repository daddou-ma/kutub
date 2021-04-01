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
import Author from "Entities/Author.entity";

@ObjectType()
@Entity()
export default class Quote {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public content: string;

  @Field((type) => ID)
  public authorId: string;

  @Field((type) => Author)
  @ManyToOne(() => Author, (author) => author.quotes)
  public author: Author;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;
}
