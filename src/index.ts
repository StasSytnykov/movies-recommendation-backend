import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import path from "path";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import * as dotenv from "dotenv";
dotenv.config();
import { schema } from "./schema";
import { context } from "./context";

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.static(path.join(__dirname, "../../client", "build")));
  app.use(express.static("public"));

  app.get("/rest", function (req, res) {
    res.json({ data: "rest works" });
  });

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 80 }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT || 80}${
      server.graphqlPath
    }`
  );
}

startApolloServer();

// export const server = new ApolloServer({
//   schema,
//   context,
// });
//
// const port = 4000;
// server.listen({ port }).then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
