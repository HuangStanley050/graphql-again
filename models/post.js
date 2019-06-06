import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      require: true
    },
    published: {
      type: Boolean,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
      }
    ]
  },
  {timestamps: true}
);

export default mongoose.mondel("Post", postSchema);
