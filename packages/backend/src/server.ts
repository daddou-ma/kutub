import "reflect-metadata";
import fs from "fs";
import path from "path";
import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import serve from "koa-static";
import compress from "koa-compress";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema, AuthChecker } from "type-graphql";
import { graphqlUploadKoa } from "graphql-upload";
import { createConnection, useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import jwt from "jsonwebtoken";
import platform from 'platform'

import User from "Modules/users/User.entity";
import Device from "Modules/devices/Device.entity";
import Context from "Interfaces/Context";

export const customAuthChecker: AuthChecker<Context> = (
  { root, args, context, info },
  roles
) => {
  if (roles.includes("ANY")) {
    return true;
  }

  if (roles.includes(context?.user?.role)) {
    return true;
  }

  if (roles.includes("GUEST") && !context.user) {
    return true;
  }

  if (roles.includes("NOBODY")) {
    return false;
  }

  return false;
}; 

async function main() {
  useContainer(Container);

  const connection = await createConnection("prod");

  const schema = await buildSchema({
    resolvers: ["src/{modules,relay}/**/*.resolver.ts"],
    container: Container,
    authChecker: customAuthChecker,
  });

  async function getCurrentDevice({ request }, user) {
    const deviceid = request?.headers?.['device-id'];
    const ua = request?.headers?.['user-agent'];
  
    let device = await connection.getRepository(Device).findOne(deviceid);
  
    if (device) {
      return device
    }
  
    const {
      name: browserName,
      version: browserVersion,
      os,
      description
    } = platform.parse(ua);
    
    try {
      return await Device.findOrCreate({
        browserName,
        browserVersion,
        os: os.toString(),
        description,
        user
      })
    } catch (exception) {
      return null;
    }
  }

  const server = new ApolloServer({
    schema,
    playground: true,
    uploads: false,
    context: async ({ ctx }): Promise<Context> => {
      const token = ctx?.request?.headers?.authorization || "";

      try {
        const { id } = jwt.verify(token.replace(/^Bearer\s/, ""), "secret");
        const user = await connection.getRepository(User).findOne(id);

        if (!user) {
          return { db: connection, repositories: {} }
        }

        let device = await getCurrentDevice(ctx, user)
        
        return { 
          db: connection,
          repositories: {},
          user,
          device,
        };
      } catch (exception) {
        console.log(exception)
        return { db: connection, repositories: {} };
      }
    },
  });

  await server.start();

  const app = new Koa();

  app.use(compress({
    threshold: 2048,
    gzip: {
      flush: require('zlib').constants.Z_SYNC_FLUSH
    },
    deflate: {
      flush: require('zlib').constants.Z_SYNC_FLUSH,
    },
    br: false // disable brotli
  }))

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

  router.get("(.*).json", async function (ctx) {
    const fileName = path.resolve("build/index.html");

    try {
      ctx.type = "html";
      ctx.body = fs.createReadStream(fileName);
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

  app.use(graphqlUploadKoa({ maxFileSize: 10000000, maxFiles: 1 }));

  server.applyMiddleware({ app });

  await new Promise((resolve) => {
    const s = app.listen({ port: process.env.PORT }, () => resolve(4000));
    s.headersTimeout = 1000 * 60 * 10;
  });

  console.log(`GraphQL is listening on !`);
}

main().catch(console.error);
