import { GraphQLServer, PubSub } from "graphql-yoga";

import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subscription";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import db from "./db";

const pubsub = new PubSub();

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

server.start(() => console.log("Server is running on localhost:4000"));
