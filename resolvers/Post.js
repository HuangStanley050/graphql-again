const Post = {
  author: (parent, args, { db }, info) =>
    db.users.find(user => parent.author === user.id),
  comments: (parent, args, { db }, info) =>
    db.comments.filter(comment => comment.post === parent.id)
};

export default Post;
