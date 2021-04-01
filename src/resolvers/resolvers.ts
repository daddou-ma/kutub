import UserResolver from "Resolvers/User.resolver";
import AuthorResolver from "Resolvers/Author.resolver";
import QuoteResolver from "Resolvers/Quote.resolver";

export const resolvers = [UserResolver, AuthorResolver, QuoteResolver] as const;
