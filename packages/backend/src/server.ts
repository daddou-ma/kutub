import "reflect-metadata";
import fs from "fs";
import path from "path";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import serve from "koa-static";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema, AuthChecker } from "type-graphql";
import { graphqlUploadKoa } from "graphql-upload";
import { createConnection, useContainer } from "typeorm";
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
    uploads: false,
    context: async ({ ctx }): Promise<Context> => {
      const token = ctx?.request?.headers?.authorization || "";

      try {
        const { id } = jwt.verify(token.replace(/^Bearer\s/, ""), "secret");
        const user = await connection.getRepository(User).findOne(id);
        return { db: connection, repositories: {}, user };
      } catch (exception) {
        return { db: connection, repositories: {} };
      }
    },
  });

  await server.start();

  const app = new Koa();

  app.use(cors());

  const router = new Router();
  app.use(serve(__dirname + "/../build"));

  router.get("/content/uploads/:folder/:file", async function (ctx) {
    const fileName = path.resolve(
      `content/uploads/${ctx.params.folder}/${ctx.params.file}`
    );

    try {
      if (fs.existsSync(fileName)) {
        ctx.body = fs.createReadStream(fileName);
        ctx.attachment(fileName);
      } else {
        ctx.throw(400, "Requested file not found on server");
      }
    } catch (error) {
      ctx.throw(500, error);
    }
  });

  router.get("(.*)", async function (ctx) {
    const fileName = path.resolve("build/index.html");

    try {
      ctx.type = "html";
      ctx.body = fs.createReadStream(fileName);
    } catch (error) {
      ctx.throw(500, error);
    }
  });

  app.use(router.routes());

  app.use(graphqlUploadKoa({ maxFileSize: 10000000, maxFiles: 10 }));

  server.applyMiddleware({ app });

  await new Promise((resolve) =>
    app.listen({ port: 4000 }, () => resolve(4000))
  );

  console.log(`GraphQL is listening on !`);
}

main().catch(console.error);
