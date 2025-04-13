// import express from "express";
// import dotenv from "dotenv";
// import usermodel from '../models/usermodel.js';
// import { signup } from "../controllers/auth/Signup.js";
// import { addfriend } from '../controllers/user';
// import { requestaction } from '../controllers/user';
// import { login } from '../controllers/auth/login.js';

// dotenv.config();

// const router = express.Router();

// router.post('/signup', signup);

// router.post('/login', login);

// router.post('/addfriend', addfriend);

// router.post('/requestaction', requestaction);


import express from "express";
 import dotenv from "dotenv";
 import usermodel from '../models/usermodel.js';
import { signup } from "../controllers/auth/signup.js";
import { addfriend } from '../controllers/user/addfriend.js';
import { requestaction } from '../controllers/user/addfriend.js';
 import { login } from '../controllers/auth/login.js';
import { authenticationcheck } from "../middlewares/authmiddleware.js";
import {friendslist} from "../controllers/user/friendslist.js";
import { requests} from '../controllers/user/getrequest.js';
import {chatuserdetail} from '../controllers/user/chatuserdetail.js';
import { allmessages} from '../controllers/user/allmessages.js';
import {latestMessage} from '../controllers/user/latestmessage.js';
import {forgot} from '../controllers/auth/forgotpassword.js';
import { changepassword } from "../controllers/auth/changepassword.js";
// import {uploadprofile} from '../controllers/user/uploadimage.js';
import multer from "multer";
import {profiledata} from '../controllers/user/profiledata.js';
import { profileupload } from "../controllers/user/profileupload.js";
import {logout} from '../controllers/auth/logout.js';
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
import {upload} from '../util/cloudinary.js';

dotenv.config();

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/addfriend',authenticationcheck, addfriend);
router.post('/requestaction',authenticationcheck, requestaction);
router.get('/friendslist',authenticationcheck, friendslist);
router.get('/getrequests',authenticationcheck,  requests);
router.post('/requestaction',authenticationcheck, requestaction);
router.post('/chatuserdetail',authenticationcheck,chatuserdetail);

router.get('/allmessages',allmessages);
router.get('/latestMessage',authenticationcheck,latestMessage);
router.post('/forgot',forgot);

router.post('/reset-password/:token',authenticationcheck,changepassword);

// router.post('/upload-profile-image', authenticationcheck,upload.single('image'),uploadprofile); 

router.get('/profiledata',authenticationcheck, profiledata);


// router.post('/upload-image', authenticationcheck,upload.single('image'), profileupload);
router.post('/upload-image', authenticationcheck,upload.single('image'), profileupload);

export default router;