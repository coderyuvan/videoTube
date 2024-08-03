import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const user = req.user?._id;
     const {content}=req.body;
     if(content.trim()==="") {
        throw new ApiError(400, "Please Enter Text");
     }

    const tweet= await Tweet.create(
        {
            content,
            owner:user
        }
    );
    if(!tweet) {
        throw new ApiError(400, "Failed to create tweet")
    }
    
    return res.
    status(201).
    json(new ApiResponse(
        201,tweet,"tweet created successfully"
    ))
})


const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const user = req.params;
    if(!user) {
        throw new ApiError(401, "Unauthorized User")
    }
   const tweet= await  Tweet.find(
        {
            owner:user
        }
    )
    if(!tweet || tweet.length === 0) {
        throw new ApiError(404, "No tweets found")
        }
        return res.
        status(200).
        json(new ApiResponse(
            200,tweet,"all tweets fetched succesfully"
        ))
})


const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params;
    const {content}=req.body
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet")
    }
   const Updatedtweet= await Tweet.findByIdAndUpdate(
        tweetId,
        {
        $set:{
            content:content
        }
        },
        {
            new:true
        }
    )
    return res.
        status(200).
        json(new ApiResponse(
            200,Updatedtweet," Tweet updated succesfully"
        ))
})


const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params;
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet")
        }

      const deletedTweet=  await Tweet.deleteOne(
            {
                _id:tweetId
            }
        )
        return res.
        status(200).
        json(new ApiResponse(
            200,{},"Tweet deleted succesfully"
            ))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}