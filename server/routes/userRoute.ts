import express from 'express';
import {Router} from 'express';
import * as userController from '../Controllers/userController';
import upload from '../middlewares/upload';
import { isAdmin, isAuth } from '../middlewares/util';

const userRouter = Router();

userRouter.post('/getAllUsers', isAuth, isAdmin, userController.allUsers);

userRouter.get('/getUser', isAuth, userController.getUserDetails);

userRouter.post('/newUser', upload.single("userImage"), userController.newUser);

userRouter.patch('/editUserDetails', isAuth, userController.editUserDetails);

userRouter.patch('/editUserImage', isAuth, upload.single("userImage"), userController.editUserImage);

userRouter.post('/auth', userController.auth);

userRouter.post('/resetPassword', userController.resetPassword);

userRouter.post('/changePassword', userController.changePassword);


export default userRouter;