import UserResolver from "Modules/users/User.resolver";
import AuthorResolver from "Modules/authors/Author.resolver";
import QuoteResolver from "Modules/quotes/Quote.resolver";

export const resolvers = [UserResolver, AuthorResolver, QuoteResolver] as const;
