import {Router} from 'express'
import * as videoController from '../Controllers/videoController';
import { isAuth } from '../middlewares/util';

const videoRouter = Router();

videoRouter.get('/:videoId', videoController.getVideo);

videoRouter.patch('/saveVideo/:videoId', isAuth, videoController.saveVideo);

videoRouter.get('/playlist/:userId', videoController.saveVideo);

// videoRouter.post('/getSavedVideos', videoController.getSavedVideos);

videoRouter.post('/allVideos', videoController.allVideos);

videoRouter.post('/newVideo', videoController.newVideo);

videoRouter.patch('/editVideo/:videoId', videoController.editVideo);

videoRouter.patch('/like/:videoId', videoController.like);

videoRouter.patch('/dislike/:videoId', videoController.dislike);

videoRouter.patch('/comment/:videoId', videoController.comment);

videoRouter.patch('/commentLike/:commentId', videoController.commentLike);

videoRouter.patch('/commentDislike/:commentId', videoController.commentDislike);

videoRouter.patch('/commentComment/:commentId', videoController.commentComment);

videoRouter.delete('/deleteVideo/:videoId', videoController.deleteVideo);


export default videoRouter;