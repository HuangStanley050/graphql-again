import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

const Query = {
  comments: async (parent, args, {db}, info) => {
    return await Comment.find({});
    //return db.comments;
  },
  posts: async (parent, args, {db}, info) => {
    if (!args.query) {
      return await Post.find({});
    }
    // if (!args.query) {
    //   return db.posts;
    // }
    // return db.posts.filter(post => {
    //   let tempTitle = post.title.toLowerCase();
    //   let tempBody = post.body.toLowerCase();
    //   if (
    //     tempBody === args.query.toLowerCase() ||
    //     tempTitle === args.query.toLowerCase()
    //   ) {
    //     return post;
    //   }
    // });
  },
  users: async (parent, args, {db}, info) => {
    if (!args.query) {
      let users = await User.find({});
      return users;
    }
    // if (!args.query) {
    //   return db.users;
    // }
    // return db.users.filter(user => {
    //   return user.name.toLowerCase().includes(args.query.toLowerCase());
    // });
  }
};

export default Query;
