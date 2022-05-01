import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  getConnection,
} from "typeorm";
import { Node } from "Relay/interfaces/Node";
import EPub from "Modules/epubs/EPub.entity";

@Entity()
@ObjectType({ implements: Node })
export default class Metadata extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public title: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 512 })
  public author: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 2048 })
  public description: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 512 })
  public isbn: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 512 })
  public language: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 512 })
  public publisher: string;

  @Field(() => Date, { nullable: true })
  @Column("datetime")
  public publishedAt: Date;

  @OneToOne(() => EPub, (epub) => epub.metadata)
  public epub: EPub;

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  public deletedAt: Date;

  public static async findOrCreate(metadata: Partial<Metadata>): Promise<Metadata> {
    const repository = getConnection("prod").getRepository(Metadata);

    let instance = await repository.findOne({ isbn: metadata.isbn });
    if (instance) return instance;
    instance = repository.create(metadata);

    return repository.save(instance);
  }
}
