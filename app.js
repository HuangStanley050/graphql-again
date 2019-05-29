// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
//
// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
import {GraphQLServer} from "graphql-yoga";

//var app = express();
const typeDefs = `
  type Query {
    id: ID!
    name:String!
    age: Int!
    employed:Boolean!
    gpa: Float
  }
`;
const resolvers = {
  Query: {
    id() {
      return "abad";
    },
    name() {
      return "Stan";
    },
    age() {
      return 22;
    },
    employed() {
      return false;
    },
    gpa() {
      return null;
    }
  }
};
const server = new GraphQLServer({typeDefs, resolvers});
// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

server.start(() => console.log("Server is running on localhost:4000"));
