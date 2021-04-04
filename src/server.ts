import "reflect-metadata";
import Koa from "koa";
import serve from "koa-static";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema, AuthChecker } from "type-graphql";
import { createConnection, useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import Context from "Interfaces/Context";

export const customAuthChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  console.log("Auth Checked Once !");
  return true;
};

async function main() {
  useContainer(Container);

  const connection = await createConnection("prod");

  const schema = await buildSchema({
    resolvers: ["src/{modules,relay}/**/*.resolver.ts"],
    container: Container,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    context: (): Context => ({ db: connection, repositories: {} }),
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
