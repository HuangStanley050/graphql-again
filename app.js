import { GraphQLServer, PubSub } from "graphql-yoga";

import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subscription";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import mongoose from "mongoose";
import db from "./db";

const pubsub = new PubSub();

const ConnectString = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWD
}@cluster0-cjli2.mongodb.net/graphqlRefresh?retryWrites=true&w=majority`;

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
    Subscription
  },
  context: { db, pubsub }
});

mongoose
  .connect(
    ConnectString,
    { useNewUrlParser: true }
  )
  .then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
  })
  .catch(err => console.log(err));
