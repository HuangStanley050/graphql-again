import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    age: Number,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
      }
    ],
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

export default mongoose.model("User", userSchema);
