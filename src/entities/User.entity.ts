import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import UserRole from "Enums/UserRole";

@ObjectType()
@Entity()
export default class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public email: string;

  @Field()
  @Column("varchar", { length: 64 })
  public password: string;

  @Field({ nullable: true })
  @Column("varchar", { nullable: true, length: 265 })
  public rememberMeToken?: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  // @beforeSave()
  // public static async hashPassword(user: User) {
  //   if (user.$dirty.password) {
  //     user.password = await Hash.make(user.password);
  //   }
  // }
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "User Types",
});
