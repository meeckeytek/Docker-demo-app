import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    image: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    email:{type: String},
    cloudinary_id:{type: String},
    isAdmin:{type: Boolean},
    savedVideos: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("User", userSchema);
