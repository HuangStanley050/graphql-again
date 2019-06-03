const Query = {
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
};

export default Query;
