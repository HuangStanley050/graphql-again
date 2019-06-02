let users = [
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
let posts = [
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
let comments = [
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

const db = {
  users,
  comments,
  posts
};

export default db;
