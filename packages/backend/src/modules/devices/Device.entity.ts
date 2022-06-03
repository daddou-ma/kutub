import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  getConnection,
} from "typeorm";
import { Node } from "Relay/interfaces/Node";
import User from "Modules/users/User.entity";
import Lecture from "Modules/lectures/Lecture.entity";

@Entity()
@ObjectType({ implements: Node })
export default class Device extends Node {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column("varchar", { length: 512 })
  public browserName: string;

  @Field()
  @Column("varchar", { length: 512 })
  public browserVersion: string;

  @Field()
  @Column("varchar", { length: 512 })
  public os: string;

  @Field()
  @Column("varchar", { length: 512 })
  public description: string;

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  public deletedAt: Date;

  @ManyToOne(() => User, (user) => user.devices)
  public user: User;

  @OneToMany(() => Lecture, (lecture) => lecture.device)
  public lectures: Lecture[];

  public static async findOrCreate(device: Partial<Device>): Promise<Device> {
    const repository = getConnection("prod").getRepository(Device);

    let instance = await repository.findOne(device);
    if (instance) return instance;
    instance = repository.create(device);

    return repository.save(instance);
  }
}
