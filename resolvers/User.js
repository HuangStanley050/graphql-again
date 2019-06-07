import Post from "../models/post";
import Comment from "../models/comment";

const User = {
  posts: async (parent, args, {db}, info) => {
    return await Post.find({author: parent.id});
    //db.posts.filter(post => parent.id === post.author);
  },
  comments: (parent, args, {db}, info) =>
    db.comments.filter(comment => parent.id === comment.author)
};

export default User;
