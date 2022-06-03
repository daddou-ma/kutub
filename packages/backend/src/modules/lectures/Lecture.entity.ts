import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "Modules/users/User.entity";
import Metadata from "Modules/metadatas/Metadata.entity";
import { Node } from "Relay/interfaces/Node";
import Device from "Modules/devices/Device.entity";

@Entity()
@ObjectType({ implements: Node })
export default class Lecture extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public filename: string;

  @Field()
  @Column("varchar", { length: 1024 })
  public filePath: string;

  @Field()
  @Column("varchar", { length: 1024 })
  public coverPath: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true, length: 1024 })
  public location: string;

  @Field({ nullable: true })
  @Column("int", { nullable: true })
  public progress: number;

  @ManyToOne(() => User, (user) => user.lectures)
  public createdBy?: User;

  @OneToOne(() => Metadata, (metadata) => metadata.lecture)
  @JoinColumn()
  public metadata?: Metadata;

  @ManyToOne(() => Device, (device) => device.lectures)
  public device?: Device;

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  public deletedAt: Date;
}
