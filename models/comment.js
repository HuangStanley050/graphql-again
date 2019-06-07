import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    text: {
      type: String,
      require: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      require: true
    }
  },
  {timestamps: true}
);

export default mongoose.model("Comment", commentSchema);
