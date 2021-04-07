import "reflect-metadata";
import Koa from "koa";
import serve from "koa-static";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema, AuthChecker } from "type-graphql";
import { Connection, createConnection, useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import jwt from "jsonwebtoken";

import User from "Modules/users/User.entity";
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
    context: async ({ ctx }): Promise<Context> => {
      const token = ctx?.request?.headers?.authorization || "";

      const { id } = jwt.verify(token.replace(/^Bearer\s/, ""), "secret");
      const user = await connection.getRepository(User).findOne(id);
      return { db: connection, repositories: {}, user };
    },
  });

  await server.start();

  const app = new Koa();

  app.use(serve(__dirname + "/../packages/frontend/build"));

  server.applyMiddleware({ app });

  await new Promise((resolve) =>
    app.listen({ port: 4000 }, () => resolve(4000))
  );

  console.log(`GraphQL is listening on !`);
}

main().catch(console.error);
