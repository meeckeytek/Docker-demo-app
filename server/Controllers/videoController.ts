import Video from "../models/video.model";
import User from "../models/user.model";
import msg from "../middlewares/messages";

export const getVideo = async (req: any, res: any) => {
  let video;
  try {
    video = await Video.findOne(req.params.videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }
  res.status(200).json(video);
};

export const saveVideo = async (req: any, res: any) => {
  let user: any;
  try {
    user = await User.findById(req.user.userId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!user) {
    return res.status(404).json({ message: msg.notFound });
  }

  for (let savedVideos of user.savedVideos)
    if (savedVideos != req.params.videoId) {
      await User.findOneAndUpdate(req.user.userId, {
        $push: { savedVideos },
      });
    }
  res.status(200).json({ message: msg.success });
};

// export const getSavedVideos = async (req: any, res: any) => {
//     let user;
//     try {
//        user = await User.findById(req.user.userId)
//     } catch (error) {
//         return res.status(500).json({message: msg.serverError})
//     }
//     if(!user){
//         return res.status(404).json({message: msg.notFound})
//     }

//     try {

//     } catch (error) {

//     }
// };

export const allVideos = async (req: any, res: any) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "-1";
  const { search } = req.body || "";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const searchQuery = {
    $or: [{ studentId: new RegExp(String(search), "i") }],
  };

  const retrievedCounts = await Video.countDocuments(searchQuery);
  Video.countDocuments(searchQuery).then((videosCount) => {
    Video.find(searchQuery)
      .sort(sortQuery)
      .limit(limit)
      .skip(page * limit - limit)
      .then((videos) => {
        return res.json({
          videos,
          pagination: {
            hasPrevious: page > 1,
            prevPage: page - 1,
            hasNext: page < Math.ceil(videosCount / limit),
            next: page + 1,
            currentPage: Number(page),
            total: retrievedCounts,
            limit: limit,
            lastPage: Math.ceil(videosCount / limit),
          },
        });
      })
      .catch((err) => console.log(err));
  });
};

export const newVideo = async (req: any, res: any) => {};

export const editVideo = async (req: any, res: any) => {};

export const like = async (req: any, res: any) => {
  let { videoId } = req.params;
  let video: any;
  try {
    video = await Video.findOne(videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }

  for (let videoDislike in video.dislikes)
    if (videoDislike !== videoId) {
      for (let videoLikes in video.likes)
        if (videoId === videoLikes) {
          await Video.findOneAndUpdate(videoId, {
            $pull: { likes: videoId },
          });
        } else {
          await Video.findOneAndUpdate(videoId, {
            $push: { likes: videoId },
          });
        }
    } else {
      await Video.findOneAndUpdate(videoId, {
        $pull: { dislikes: videoId },
      });
    }
  res.status(200).json({ message: msg.success });
};

export const dislike = async (req: any, res: any) => {
  let { videoId } = req.params;
  let video: any;
  try {
    video = await Video.findOne(videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }

  for (let videoLike in video.likes)
    if (videoLike !== videoId) {
      for (let videoDislikes in video.dislikes)
        if (videoId === videoDislikes) {
          await Video.findOneAndUpdate(videoId, {
            $pull: { dislikes: videoId },
          });
        } else {
          await Video.findOneAndUpdate(videoId, {
            $push: { dislikes: videoId },
          });
        }
    } else {
      await Video.findOneAndUpdate(videoId, {
        $pull: { likes: videoId },
      });
    }
  res.status(200).json({ message: msg.success });
};

export const comment = async (req: any, res: any) => {
  const { comment } = req.body;
  let video: any;
  try {
    video = await Video.findById(req.params.videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }

  let newComment = {
    user: req.user.userId,
    comment,
  };

  await Video.findOneAndUpdate(req.params.videoId, {
    $push: { comment: newComment },
  });
  res.status(200).json({ message: msg.success });
};

export const commentLike = async (req: any, res: any) => {
  let video: any;
  try {
    video = await Video.findById(req.params.videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }
};

export const commentDislike = async (req: any, res: any) => {
  let video: any;
  try {
    video = await Video.findById(req.params.videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }
};

export const commentComment = async (req: any, res: any) => {
  let video: any;
  try {
    video = await Video.findById(req.params.videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!video) {
    return res.status(404).json({ message: msg.notFound });
  }
};

export const deleteVideo = async (req: any, res: any) => {
  try {
    await Video.findOneAndDelete(req.params.videoId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  res.status(200).json({ message: msg.success });
};
