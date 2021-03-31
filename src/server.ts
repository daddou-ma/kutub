import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema, AuthChecker } from "type-graphql";
import { createConnection } from "typeorm";
import Context from "Interfaces/Context";
import { resolvers } from "Resolvers/resolvers";

export const customAuthChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  console.log("Auth Checked Once !");
  return true;
};

async function main() {
  const connection = await createConnection("prod");

  const schema = await buildSchema({
    resolvers: resolvers,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ manager: connection.manager }),
  });

  const { port } = await server.listen(4000);

  console.log(`GraphQL is listening on ${port}!`);
}

main().catch(console.error);
