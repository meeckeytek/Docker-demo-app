import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelLogo: { type: String },
    name: { type: String },
    about: { type: String },
    description: { type: String },
    url: { type : String },
    subscribers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
    cloudinary_id:{type: String}
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Channel", channelSchema);