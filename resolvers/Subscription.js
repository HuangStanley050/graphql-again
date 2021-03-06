const Subscription = {
  post: {
    subscribe: (parent, args, {db, pubsub}, info) => {
      return pubsub.asyncIterator("post");
    }
  },
  count: {
    subscribe: (parent, args, {pubsub}, info) => {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count
        });
      }, 1000);
      return pubsub.asyncIterator("count");
    }
  },
  comment: {
    subscribe: (parent, {postID}, {db, pubsub}, info) => {
      const post = db.posts.find(post => post.id === postID && post.published);
      if (!post) {
        throw new Error("Post not found");
      }
      return pubsub.asyncIterator(`comment ${postID}`);
    }
  }
};

export default Subscription;
