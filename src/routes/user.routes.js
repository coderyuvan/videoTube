import { Router } from "express";
import { accessRefreshToken, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWwatchHistory, loginUser, logout, registerUser, updateAllDetails, updateCoverImage, updateUserAvatar } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
// router created
const router=Router();
// step1 of user m reques dene se phle ask for user ki avatar and image
router
.route("/register")
.post(
    // injected middleware
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
        ]),
    registerUser
)

router.route("/login").post(loginUser)

// seured routes
router.route("/logout").post(verifyJWT, logout)
router.route("/refresh-token").post(accessRefreshToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)
// patch bcoz post will uplaod all fileds
router.route("/update-details") .patch(verifyJWT,updateAllDetails);

router.route("/update-avatar") .patch(verifyJWT,upload.single("avatar"), updateUserAvatar);

router.route("/update-coverImage").patch(verifyJWT,upload.single("coverImage"), updateCoverImage);

// param se data lia h
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWwatchHistory);

export default router