import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String },
    owner: { type: String },
    channel: { type: String, ref:'Channel' },
    views: [{ type: String }],
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    tags: [{ type: String }],
    comment: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
        likes: [{ type: String }],
        dislikes: [{ type: String }],
      },
    ],
    commentLike: [{ type: String }],
    commentDislike: [{ type: String }],
    commentComment: [
      {
        commentId: { type: String },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        comment: { type: String },
        likes: [{ type: String }],
        dislikes: [{ type: String }],
      },
    ],
    vidoe: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Video", videoSchema);
