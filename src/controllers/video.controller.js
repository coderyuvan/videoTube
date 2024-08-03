import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary,deleteVideoOnClodinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    

})



const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if([title,description ].some((feild)=>feild?.trim()===""))
    {
     throw new ApiError("400","title and description are required")
    }
    
    const videoPath=req.files?.videoFile[0]?.path
    const thumbnailPath=req.files?.thumbnail[0]?.path
    if(!videoPath && !thumbnailPath) {
        throw new ApiError("400", "Video and thumbnail are required")
    }
   const video=  await uploadOnCloudinary(videoPath)
   const thumbnail=  await uploadOnCloudinary(thumbnailPath)

   const publishVideo=await  Video.create({
    title:title,
    description:description,
    video:video.url,
    thumbnail:thumbnail.url,
    duration:video.duration,
    owner: req.user._id
   })

   return res.status(201)
    .json(new ApiResponse(200, publishVideo, "Video Published Successfully"))
     
})



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId)) {
        throw new ApiError("400", "Invalid video id")
    }
   const video= await Video.findById(videoId)
    if(!video) {
        throw new ApiError("404", "Video not found")
        }
        return res.status(200)
        .json(
            200,
            video,
            "Video found successfully"
        )
})



const updateVideo = asyncHandler(async (req, res) => {

    //TODO: update video details like title, description, thumbnail

    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError("400", "Invalid video id")
    }  
     
    const {title,description}=req.body;
    if([title,description ].some((feild)=>feild?.trim()===""))
        {
            throw new ApiError("400","title and description are required")
         }

       const thumbnailPath=req.files?.thumbnail[0]?.path
         if(!thumbnailPath) {
             throw new ApiError("400", " thumbnail is required")
         }
        const thumbnail=  await uploadOnCloudinary(thumbnailPath)

        if(!thumbnail.url){
            throw new ApiError(400, "Error while uloading thumbnail")
        }

      const updatedVideo=  await Video.findByIdAndUpdate(
            videoId,
            {
             title:title,
             description:description,
             thumbnail:thumbnail.url,
            },
            {
                new:true,
            }
        )
    
        if(!updatedVideo) {
            throw new ApiError("404", "There was a issue while uploading the video")
            }
            return res.status(200)
            .json(
                200,
                updatedVideo,
                "Video updated successfully"
                )
     
})


const deleteVideo = asyncHandler(async (req, res) => {
     //TODO: delete video
    const { videoId } = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError("400", "Invalid video id")
        }
    
        const video =  await Video.findById(videoId);

        await deleteVideoOnClodinary(video.thumbnail.public_id)
    
        await deleteVideoOnClodinary(video.videoFile.public_id)
    
        
   const deletedVideo= await Video.findByIdAndDelete({
        _id:videoId
    })

    if(!deletedVideo) {
        throw new ApiError("404", "Video not found")
        }
        return res.status(200)
        .json(200, {},"Video deleted successfully")

})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found")
    }
    // Toggle the isPublish field
    video.isPublished = !video.isPublished;

    // Save the updated video
    await video.save();

    return res.status(200)
        .json(new ApiResponse(200, video, "isPublished toggle Successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}