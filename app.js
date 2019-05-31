import {GraphQLServer} from "graphql-yoga";
import uuidv4 from "uuid/v4";
//var app = express();
const users = [
  {
    id: "1",
    name: "Stan",
    email: "test@test.com"
  },
  {
    id: "2",
    name: "Steve",
    email: "test2@test.com"
  },
  {
    id: "3",
    name: "Sarah",
    email: "test3@test.com"
  }
];
const posts = [
  {
    id: "10",
    title: "test",
    body: "javascript",
    published: false,
    author: "1"
  },
  {
    id: "21",
    title: "test2",
    body: "react",
    published: true,
    author: "1"
  },
  {
    id: "33",
    title: "test3",
    body: "music",
    published: true,
    author: "3"
  }
];
const comments = [
  {
    id: "24",
    text: "I am comment1",
    author: "2",
    post: "21"
  },
  {
    id: "25",
    text: "I am comment2",
    author: "1",
    post: "33"
  },
  {
    id: "26",
    text: "I am comment3",
    author: "2",
    post: "10"
  },
  {
    id: "27",
    text: "I am comment4",
    author: "3",
    post: "10"
  }
];
const typeDefs = `
  type Query {
    users(query:String): [User]!
    posts(query:String): [Post]!
    comments: [Comment]!
    me: User!
    post: Post!
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

  type Mutation {
    createUser(name:String!,email:String!,age:Int):User!
  }

  type Comment {
    id:ID!
    text:String!
    author: User!
    post: Post!
  }

  type User {
    id:ID!
    email:String!
    name:String!
    age: Int
    posts:[Post!]!
    comments:[Comment!]!
  }

  type Post {
    id:ID!
    title:String!
    body:String!
    published:Boolean!
    author: User!
    comments: [Comment!]!
  }
`;
const resolvers = {
  Query: {
    comments: (parent, args, ctx, info) => {
      return comments;
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        let tempTitle = post.title.toLowerCase();
        let tempBody = post.body.toLowerCase();
        if (
          tempBody === args.query.toLowerCase() ||
          tempTitle === args.query.toLowerCase()
        ) {
          return post;
        }
      });
    },
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
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
  },
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const emailTaken = users.some(user => args.email === user.email);
      if (emailTaken) {
        throw new Error("User email already exist");
      }
      const user = {
        id: uuidv4(),
        email: args.email,
        name: args.name,
        age: args.age
      };
      users.push(user);
      return user;
    }
  },
  Comment: {
    author: (parent, args, ctx, info) =>
      users.find(user => parent.author === user.id),
    post: (parent, args, ctx, info) =>
      posts.find(post => post.id === parent.post)
  },
  Post: {
    author: (parent, args, ctx, info) =>
      users.find(user => parent.author === user.id),
    comments: (parent, args, ctx, info) =>
      comments.filter(comment => comment.post === parent.id)
  },
  User: {
    posts: (parent, args, ctx, info) =>
      posts.filter(post => parent.id === post.author),
    comments: (parent, args, ctx, info) =>
      comments.filter(comment => parent.id === comment.author)
  }
};
const server = new GraphQLServer({typeDefs, resolvers});

server.start(() => console.log("Server is running on localhost:4000"));
