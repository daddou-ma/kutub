import { registerEnumType } from "type-graphql";
import UserRole from "Enums/UserRole";

registerEnumType(UserRole, {
  name: "UserRole",
  description: "User Roles",
});
