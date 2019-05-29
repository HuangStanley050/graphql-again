import {GraphQLServer} from "graphql-yoga";

//var app = express();
const typeDefs = `
  type Query {
   me: User!
   post: Post!
  }
  type Post {
    id:ID!
    title:String!
    body:String!
    published:String!
  }
  type User {
    id:ID!
    email:String!
    name:String!
    age: Int
  }
`;
const resolvers = {
  Query: {
    post: () => ({
      id: "asdfsadf",
      title: "wow that's huge",
      body: "la la la",
      published: "june 1st"
    }),
    me: () => ({
      id: "asdfas",
      email: "infamous_godhand@yahoo.com",
      name: "Stanley",
      age: 38
    })
  }
};
const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => console.log("Server is running on localhost:4000"));
