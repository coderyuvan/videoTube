import mongoose, { Types } from "mongoose"
import {User} from "../models/video.model.js"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const user=req.user?._id
    if(!user) {
        return new ApiError(401, "Unauthorized")
    }

    let obj={};
    const videoStats=await User.aggregate([
        {
            $match:{
                _id:user
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"Totalvideos"
            }
        },
        {
            $addFields:{
                Totalvideos:"$Totalvideos"
            }
           
        },
        {
            $unwind:"$Totalvideos"
        },
        {
            $group:{
                _id:"$_id",
                Totalvideos:{
                    $sum:1
                },
                Totalviews:{
                    $sum:"$Totalvideos.views"
                },
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"TotalSubscribers"
            }

        },
        {
            $addFields:{
                TotalSubscribers:{
                    $first:"$TotalSubscribers"
                },
            },
        },
        {
            $project:{
                Totalvideos:1,
                Totalviews:1,
                TotalSubscribers:{
                    $size:
                        "$TotalSubscribers.subscriber"
                    
                },
            }
        }

    ])
    if(!videoStats){
        obj["videosDetails"]=0;
    }
    
    const LikesDetailsofVideo= await Video.aggregate([
        {
            $match:{
                owner:user
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"TotalLikes"
                }
        },
        
        {
            $unwind:"$TotalLikes"
        },
        {
            $group:{
                _id:"$TotalLikes._id",
                    }
        },
        {
            $count:"totallike"
           }
    ])
     if(!LikesDetailsofVideo){
        obj["videosDetails"]=0;
     }

     const LikesDetailsofcomments= await Comment.aggregate([
        {
            $match:{
                owner:user
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"comment",
                as:"TotalCommentLikes"
                }
        },
        
        {
            $unwind:"$TotalCommentLikes"
        },
        {
            $group:{
                _id:"$TotalCommentLikes._id",
                    }
        },
        {
            $count:"totallike"
           }
    ])
     if(!LikesDetailsofcomments){
        obj["videosDetails"]=0;
     }

     obj["videosdetails"]=videoStats
     obj["likedetails"]=LikesDetailsofVideo
     obj["commentlikes"]=LikesDetailsofcomments

     return res.json(
        new apiResponse(
            200,
            obj
            
        )
    )
})

 
const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
     const channelId= new mongoose.Types.ObjectId( req.user?._id)
     if(!channelId) {
        throw new ApiError(400,"Channel Not Found")
      }

      const allVideos=await Video.find({
        owner:channelId
      })
       if(!allVideos) {
        throw new ApiError(400,"No Videos Found")
       }
       return res
       .status(200).
       json(new ApiResponse(
        200
        ,allVideos
        ,allVideos
    ))
}) 

export {
    getChannelStats, 
    getChannelVideos
    }