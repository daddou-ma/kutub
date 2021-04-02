import "reflect-metadata";
import Koa from "koa";
import serve from "koa-static";
import { ApolloServer } from "apollo-server-koa";
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

  await server.start();

  const app = new Koa();

  app.use(serve(__dirname + "/../packages/frontend/build"));

  server.applyMiddleware({ app });
  // alternatively you can get a composed middleware from the apollo server
  // app.use(server.getMiddleware());

  await new Promise((resolve) =>
    app.listen({ port: 4000 }, () => resolve(4000))
  );

  //const = await server.listen(4000);

  console.log(`GraphQL is listening on !`);
}

main().catch(console.error);
