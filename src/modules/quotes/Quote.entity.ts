import { ObjectType, Field, ID, Int } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from "typeorm";
import base64 from "base-64";
import Author from "Modules/authors/Author.entity";

@ObjectType()
@Entity()
export default class Quote {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public content: string;

  @Field((type) => ID)
  public authorId: string;

  @Field((type) => Author)
  @ManyToOne(() => Author, (author) => author.quotes)
  public author: Author;

  @Field((type) => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field((type) => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field((type) => Date)
  @DeleteDateColumn()
  public deletedAt: Date;

  @Field()
  public get hash(): string {
    return base64.encode(this.id.toString());
  }
}
