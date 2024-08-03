import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
        }
        // checking  ki video is liked or not
      const like=  await Like.findOne(
            {
                video:videoId,
                likedBy:req.user?._id
            }
        )
        if(like){
            await like.deleteOne()
            return res.status(200).json(200,{},"liked removed succcessfully")
        }

        // if not liked then like it
       const likedVideo= await Like.create(
            {
                video:videoId,
                likedBy:req.user?._id
            }
        )
        return res.status(200).json(200,likedVideo,"video liked  succcessfully")
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid video id")
        }
        // checking  ki video is liked or not
      const like=  await Like.findOne(
            {
                comment:commentId,
                likedBy:req.user?._id
            }
        )
        if(like){
            await like.deleteOne( )
            return res.status(200).json(200,{},"liked removed succcessfully")
        }

        // if not liked then like it
       const likedComment= await Like.create(
            {
                comment:commentId,
                likedBy:req.user?._id
            }
        )
        return res.status(200).json(200,likedComment,"video liked  succcessfully")

})


const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid video id")
        }
        /// check already liked or not
    const like= await Like.findById(
            {
                tweet:tweetId,
                likedBy:req.user?._id
            }
        )
        if(like){
            await like.deleteOne()
            return res.status(200).json(200,{},"liked removed succcessfully")
}

  const likedTweet=await Like.create(
    {
        tweet:tweetId,
        likedBy:req.user?._id
    }
  )
   
  return res.status(200).json(200,likedTweet,"Tweet liked succcessfully")

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}