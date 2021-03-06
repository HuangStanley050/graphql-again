import uuidv4 from "uuid/v4";
import User from "../models/user";
import Post from "../models/post";
import Comment from "../models/comment";

const Mutation = {
  updateComment: (parent, args, {db, pubsub}, info) => {
    const comment = db.comments.find(comment => comment.id === args.id);
    if (!comment) {
      throw new Error("No comment found");
    }
    if (typeof args.data.text === "string") {
      comment.text = args.data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });
    return comment;
  },
  updatePost: (parent, args, {db, pubsub}, info) => {
    const post = db.posts.find(post => post.id === args.id);
    const originalPost = {...post};
    //console.log(args.data);
    if (!post) {
      throw new Error("post doesn't exist");
    }

    if (typeof args.data.title === "string") {
      post.title = args.data.title;
    }

    if (typeof args.data.body === "string") {
      post.body = args.data.body;
    }

    if (typeof args.data.published === "boolean") {
      post.published = args.data.published;
      //console.log("yes");
      if (originalPost.published && !post.published) {
        //delete
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        //create
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.published) {
      //update
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },
  updateUser: (parent, args, {db}, info) => {
    const user = db.users.find(user => user.id === args.id);
    if (!user) {
      throw new Error("User doesn't exist");
    }
    if (typeof args.data.email === "string") {
      const emailTaken = db.users.some(user => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email in use");
      }
      user.email = args.data.email;
    }
    if (typeof args.data.name === "string") {
      user.name = args.data.name;
    }
    if (typeof args.data.age !== undefined) {
      user.age = args.data.age;
    }
    return user;
  },
  deleteComment: (parent, args, {db, pubsub}, info) => {
    let deletedComment = db.comments.find(comment => comment.id === args.id);
    if (!deletedComment) {
      throw new Error("No comment found");
    }
    db.comments = db.comments.filter(comment => comment.id !== args.id);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  },
  deletePost: (parent, args, {db, pubsub}, info) => {
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post doesn't exist");
    }
    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => {
      return comment.post !== args.id;
    });
    if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: "DELETED",
          data: post
        }
      });
    }
    return post;
  },
  deleteUser: (parent, args, {db}, info) => {
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
  createPost: async (parent, args, {db, pubsub}, info) => {
    const user = await User.findOne({_id: args.data.author});
    if (!user) {
      throw new Error("User doesn't exist");
    }
    const newPost = new Post({
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: args.data.author
    });
    let result = await newPost.save();
    return result;
    // const userExists = db.users.some(user => user.id === args.data.author);
    // if (!userExists) {
    //   throw new Error("User doesn't exist");
    // }
    // const post = {
    //   id: uuidv4(),
    //   ...args.data
    // };
    // db.posts.push(post);
    // if (post.published) {
    //   pubsub.publish(`post`, {
    //     post: {
    //       mutation: "CREATED",
    //       data: post
    //     }
    //   });
    // }
    // return post;
  },
  createUser: async (parent, args, {db}, info) => {
    let user = await User.findOne({email: args.data.email});
    if (user) {
      throw new Error("user already exists!!");
    }
    let newUser = new User({
      email: args.data.email,
      name: args.data.name,
      age: args.data.age
    });

    let result = newUser.save();

    return result;

    // const emailTaken = db.users.some(user => args.data.email === user.email);
    // if (emailTaken) {
    //   throw new Error("User email already exist");
    // }
    // const user = {
    //   id: uuidv4(),
    //   ...args.data
    // };
    // db.users.push(user);
    // return user;
  },
  createComment: async (parent, args, {db, pubsub}, info) => {
    let userExists = await User.findOne({_id: args.data.author});
    let postExists = await Post.findOne({_id: args.data.post});

    if (!userExists || !postExists || !postExists.published) {
      throw new Error(
        "User doesn't exists or the post have not been published"
      );
    }

    const newComment = new Comment({
      ...args.data
    });

    let result = await newComment.save();
    return result;

    // const userExists = db.users.some(user => user.id === args.data.author);
    // const postExists = db.posts.some(
    //   post => post.id === args.data.post && post.published
    // );
    //
    // if (!userExists || !postExists) {
    //   throw new Error("User doesn't exists or the post hasn't been published");
    // }
    // const comment = {
    //   id: uuidv4(),
    //   ...args.data
    // };
    // db.comments.push(comment);
    //
    // pubsub.publish(`comment ${args.data.post}`, {
    //   comment: {
    //     mutation: "CREATED",
    //     data: comment
    //   }
    // });
    //
    // return comment;
  }
};

export default Mutation;
