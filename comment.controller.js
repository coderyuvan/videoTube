import mongoose , {isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//doubt
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip = (page - 1) * limit
    const user=req.user?._id
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid VideoId")
    }
   const VideoComments= await Comment.aggregate([
        {
           $match:{
          video:videoId
           }
        },
        
        {
          $lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"videoComments"
          }
        },
        {
            $unwind:"$videoComments"
        },
        {
            $project:{
                videoComments:1
            }
        },
        {
            $skip:skip
        },
        {
            $limit:parseInt(limit)
        }
        
    ])

    if(!VideoComments) {
        throw new ApiError(404, "No comments found")
    }
    return res
    .status(200)
    .json(
        200,
        VideoComments,
        "Comments Fetched Succesfully"
    )
})



const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const user=req._id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const content=req.body;
    if(!content) {
        throw new ApiError(400, "Content is required")
    }
   const comment= await Comment.create({
        content:content,
        video:videoId,
        owner:user
    })
    return res
    .status(200)
    .json(new ApiResponse(
        200,comment, "Comment added successfully"
    ))
    
})


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
        }
    
    if(!content) {
            throw new ApiError(400, "Content is required")
            }
    const updatedComment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
         content:content
            }
        },
        {
            new: true
        }
    )
    if(!updatedComment){
        throw new ApiError(404, "Comment not found")
        }
        return res
        .status(200)
        .json(new ApiResponse(
            200, updateComment, "Comment updated successfully"
        ))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
        }
       await Comment.deleteOne(
            {
                _id:commentId
            }
        )
        return res
        .status(200)
        .json(new ApiResponse(
            200, {}, "Comment deleted successfully"
        ))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }