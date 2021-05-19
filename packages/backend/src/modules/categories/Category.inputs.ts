import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";
import Category from "Modules/categories/Category.entity";

@InputType({ description: "Create Category data" })
export class CreateCategoryInput implements Partial<Category> {
  @Field()
  @MaxLength(48)
  name: string;
}

@InputType({ description: "Update Category data" })
export class UpdateCategoryInput implements Partial<Category> {
  @Field()
  @MaxLength(48)
  name: string;
}
