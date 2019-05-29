// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
//
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
import { GraphQLServer } from "graphql-yoga";

//var app = express();
const typeDefs = `
  type Query {
    greeting(stuff: String): String!
    name: String!
  }
`;
const resolvers = {
  Query: {
    greeting: (parent, { stuff }, ctx, info) => "hi there " + stuff,
    name: () => "hi there"
  }
};
const server = new GraphQLServer({ typeDefs, resolvers });
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

server.start(() => console.log("Server is running on localhost:4000"));
