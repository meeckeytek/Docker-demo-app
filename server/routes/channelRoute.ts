// import {Router} from 'express';
// import * as channelController from "../Controllers/channelController";
// import upload from '../middlewares/upload';
// import { isAdmin, isAuth } from '../middlewares/util';

// const channelRouter = Router();

// channelRouter.get('/', channelController.getChannel);

// channelRouter.get('/allUserChannels', isAuth, channelController.allUserChannels);

// channelRouter.post('/allChannels', isAuth, isAdmin, channelController.allChannels);

// channelRouter.post('/newChannel', isAuth, upload.single("channelLogo"), channelController.newChannel);

// channelRouter.patch('/editChannelDetails/:channelId', isAuth, channelController.editChannelDetails);

// channelRouter.patch('/editChannelLogo/:channelId', isAuth, upload.single("channelLogo"), channelController.editChannelLogo);

// channelRouter.patch('/subscribe/:channelId', isAuth, channelController.subscribe);

// channelRouter.delete('/deleteChannel/:channelId', isAuth, channelController.deleteChannel);


// export default channelRouter;