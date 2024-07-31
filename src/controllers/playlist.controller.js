import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    
    
if(
    [name, description].some((field)=> field?.trim()==="")
    
){
    throw new ApiError(400, "Name and description are required")
}

const playlist= await Playlist.create({name,description});

if(!playlist) {
throw new ApiError(500, "something went wrong !!!  Playlist not created")
}
return res
        .status(201)
        .json(new ApiResponse(200,playlist,"Playlist created successfully"))
     
})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"InValid User")
      }
      // find jb v use kro mention the owner /user field
    const playlists=await Playlist.find({owner:userId})
    
    if(!playlists) {
        throw new ApiError(404, "Playlists not found")
    }
    
    return res
             .status(200)
             .json(new ApiResponse(200,playlists,"User playlists found"))

})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"InValid Playlist")
        }
        const playlist=await Playlist.findById(playlistId)

        if(!playlist) {
            throw new ApiError(404, "Playlist not found")
        }
        
        return res
        .status(200)
        .json(new ApiResponse(200,playlist,"Playlist found"))

})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //TODO: add video to playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"InValid Playlist")
        }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"InValid Video")
    }
     
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId
        ,{
            $push:{videos:videoId}
    },
    {new: true, useFindAndModify: false}
    )
    
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(201)
    .json(new ApiResponse(201,playlist,"Video added to playlist"))
    
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"InValid Playlist")
        }
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"InValid Video")
    }
    const playlist=await Playlist.findByIdAndDelete(
         playlistId,
         {
            $pull: {videos: videoId}
            },
            {new: true, useFindAndModify: false}
    )
    
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(201)
    .json(new ApiResponse(201,playlist,"Video deleted from  playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"InValid Playlist")
        }
        // delete m seehda id m us playlist ki id do and delete bs
     
      const deletedPlaylist=  await Playlist.findByIdAndDelete({_id: playlistId})
                
        if(!deletedPlaylist) {
            throw new ApiError(404, "Playlist not found")
            }
            return res
            .status(201)
            .json(new ApiResponse(201,deletedPlaylist,"Playlist deleted"))
            
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"InValid Playlist")
        }
        const playlist = await Playlist.findByIdAndUpdate(
            playlistId, 
            {
                $set:{
                name:name,
                description:description
                }
            }, 
            {
                new: true
            }

        )
        if(!playlist) {
            throw new ApiError(404, "Playlist not found")
            }
            return res
            .status(200)
            .json(new ApiResponse(200,playlist,"Playlist updated"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}