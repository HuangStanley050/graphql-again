const Comment = {
  author: (parent, args, { db }, info) =>
    db.users.find(user => parent.author === user.id),
  post: (parent, args, { db }, info) =>
    db.posts.find(post => post.id === parent.post)
};

export default Comment;
