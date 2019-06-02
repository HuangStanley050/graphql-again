import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
//var app = express();
import db from "./db";

const resolvers = {
  Query: {
    comments: (parent, args, { db }, info) => {
      return db.comments;
    },
    posts: (parent, args, { db }, info) => {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter(post => {
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
    users: (parent, args, { db }, info) => {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    }
  },
  Mutation: {
    deleteComment: (parent, args, { db }, info) => {
      let deletedComment = db.comments.find(comment => comment.id === args.id);
      if (!deletedComment) {
        throw new Error("No comment found");
      }
      db.comments = db.comments.filter(comment => comment.id !== args.id);
      return deletedComment;
    },
    deletePost: (parent, args, { db }, info) => {
      const postIndex = db.posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) {
        throw new Error("Post doesn't exist");
      }
      const deletedPost = db.posts.splice(postIndex, 1);
      db.comments = db.comments.filter(comment => {
        return comment.post !== args.id;
      });
      return deletedPost[0];
    },
    deleteUser: (parent, args, { db }, info) => {
      const userIndex = db.users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error("No user found");
      }
      const deletedUser = db.users.splice(userIndex, 1);
      //console.log(deletedUser);
      db.posts = db.posts.filter(post => {
        let matched = post.author === args.id;
        if (matched) {
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }

        return !matched;
      });
      db.comments = db.comments.filter(comment => comment.author !== args.id);
      return deletedUser[0];
    },
    createPost: (parent, args, { db }, info) => {
      const userExists = db.users.some(user => user.id === args.data.author);
      if (!userExists) {
        throw new Error("User doesn't exist");
      }
      const post = {
        id: uuidv4(),
        ...args.data
      };
      db.posts.push(post);
      return post;
    },
    createUser: (parent, args, { db }, info) => {
      const emailTaken = db.users.some(user => args.data.email === user.email);
      if (emailTaken) {
        throw new Error("User email already exist");
      }
      const user = {
        id: uuidv4(),
        ...args.data
      };
      db.users.push(user);
      return user;
    },
    createComment: (parent, args, { db }, info) => {
      const userExists = db.users.some(user => user.id === args.data.author);
      const postExists = db.posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error(
          "User doesn't exists or the post hasn't been published"
        );
      }
      const comment = {
        id: uuidv4(),
        ...args.data
      };
      db.comments.push(comment);
      return comment;
    }
  },
  Comment: {
    author: (parent, args, { db }, info) =>
      db.users.find(user => parent.author === user.id),
    post: (parent, args, { db }, info) =>
      db.posts.find(post => post.id === parent.post)
  },
  Post: {
    author: (parent, args, { db }, info) =>
      db.users.find(user => parent.author === user.id),
    comments: (parent, args, { db }, info) =>
      db.comments.filter(comment => comment.post === parent.id)
  },
  User: {
    posts: (parent, args, { db }, info) =>
      db.posts.filter(post => parent.id === post.author),
    comments: (parent, args, { db }, info) =>
      db.comments.filter(comment => parent.id === comment.author)
  }
};
const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers,
  context: { db }
});

server.start(() => console.log("Server is running on localhost:4000"));
