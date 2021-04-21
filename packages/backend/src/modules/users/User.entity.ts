import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import jwt from "jsonwebtoken";

import { Node } from "Relay/interfaces/Node";
import Quote from "Modules/quotes/Quote.entity";
import UserRole from "Enums/UserRole";
import EPub from "Modules/epubs/EPub.entity";

@Entity()
@ObjectType({ implements: Node })
export default class User extends Node {
  @Field(() => ID)
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

  @Field(() => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  public deletedAt: Date;

  @Field(() => Date)
  @OneToMany(() => EPub, (epub) => epub.createdBy)
  public epubs: EPub[];

  @ManyToMany(() => Quote, (quote) => quote.favoredBy)
  @JoinTable()
  public favoriteQuotes: Quote[];

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
