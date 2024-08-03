import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"invalid ChannelId")
    }
    const Checksubscribe=await Subscription.findOne(
        {
            channel:channelId,
            subscriber:req.user?._id
        }
    )
    if(Checksubscribe){
       await Checksubscribe.deleteOne()
       return res.status(200).json(new ApiResponse(200, {}, "Subscription Removed Successfully"))
    }
    await Subscription.create(
        {
            channel:channelId,
            subscriber:req.user?._id
        }
    )
    return res.status(200).json(new ApiResponse(200, {}, "Subscription Added Successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"invalid ChannelId")
    }

   const subscriberCount= await Subscription.findById(
        {
            channel:channelId,
            
        }
        
    ).populate('subscriber')

    return res
    .status(200)
    .json(
        200,
        subscriberCount,
        "Subscribers are fetched successfully"
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId) {
        throw new ApiError(400,"invalid SubscriberId")
    }

    const subscribedToCount= await Subscription.findById(
        {
             subscriber:subscriberId
            
        }
        
    ).populate('channel')

    return res
    .status(200)
    .json(
        200,
        subscribedToCount,
        "Subscribers are fetched successfully"
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}