import {GraphQLServer} from "graphql-yoga";

//var app = express();
const typeDefs = `
  type Query {
    greeting(name:String): String!
    float(num1:Float!,num2:Float!):Float!
    add(number: [Float!]!): Float!
    grades: [Int!]!
    id: ID!
    name:String!
    age: Int!
    employed:Boolean!
    gpa: Float
  }
`;
const resolvers = {
  Query: {
    grades: (parent, args, ctx, info) => {
      return [99, 22, 54, 88];
    },
    add: (parent, args, ctx, info) => {
      if (args.number.length === 0) {
        return 0;
      } else {
        return args.number.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
      }
    },
    float: (parent, args, ctx, info) => args.num1 + args.num2,
    greeting: (parent, args, ctx, info) => "hello " + args.name,
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

server.start(() => console.log("Server is running on localhost:4000"));
