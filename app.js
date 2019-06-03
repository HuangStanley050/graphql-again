import {GraphQLServer} from "graphql-yoga";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import db from "./db";

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  context: {db}
});

server.start(() => console.log("Server is running on localhost:4000"));
