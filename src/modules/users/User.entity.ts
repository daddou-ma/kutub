import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import jwt from "jsonwebtoken";
import UserRole from "Enums/UserRole";

@ObjectType()
@Entity()
export default class User {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  public id: number;

  @Field({ nullable: true })
  @Column("varchar", { length: 64, nullable: true })
  public name?: string;

  @Field()
  @Column("varchar", { length: 64, unique: true })
  public email: string;

  @Column("varchar", { length: 64, nullable: true })
  public password: string;

  @Field({ nullable: true })
  @Column("varchar", { length: 256, nullable: true })
  public picture: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column("varchar", { unique: true, nullable: true })
  public googleId: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date;

  public generateJWT(): string {
    const today = new Date();
    const expiration = new Date(today);
    expiration.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        id: this.id,
        exp: expiration.getTime() / 1000,
      },
      "secret"
    );
  }
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "User Types",
});
