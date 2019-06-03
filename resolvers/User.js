const User = {
  posts: (parent, args, {db}, info) =>
    db.posts.filter(post => parent.id === post.author),
  comments: (parent, args, {db}, info) =>
    db.comments.filter(comment => parent.id === comment.author)
};

export default User;
