import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path"
import * as dotenv from "dotenv";
import userRoute from "./routes/userRoute";
// import channelRouter from "./routes/channelRoute";
import videoRouter from "./routes/videoRoute";

dotenv.config();

const app = express();

// app.use('/static', express.static("uploads"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join("uploads")));

app.use("/api/v1/user", userRoute);
// app.use("/api/v1/channel", channelRouter);
app.use("/api/v1/video", videoRouter);

mongoose
  .connect(process.env.URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });
