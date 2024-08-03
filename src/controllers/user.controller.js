import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
// for 3 we import user
import {User} from "../models/user.model.js"
import {uploadOnClodinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from  "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshToken=async(userId)=> {
  try {
 const user= await User.findById(userId)

 const Accesstoken= user.generateAccessToken()

 const RefeshToken= user.generateRefreshToken()

 // reffresh token in db daalo
 user.RefeshToken=RefeshToken
 await user.save({validateBeforeSave:false})

 return {Accesstoken,RefeshToken}

  } catch (error) {
    throw new ApiError(500,"something went wrong while generating refresh and access token")
  }
}

// user getting registered
const registerUser=asyncHandler( async(req,res)=>{
     
// 1.
 const {fullName,email, username,password}=req.body;// re.body se json and form data aayega url ka case alg h

 //2.
  if (
    [fullName,email,username,password].some((field)=>field?.trim()==="")
  ) {
    throw new ApiError(400,"All fields are required")
  }

  //3.
  const exsistedUser=await User.findOne({
    // checking exisitence on 2 basis
    $or:[{ username },{ email }]
  })
  
  if(exsistedUser) { 
    throw new ApiError(409,"User already exsist")
  }

   //4.
   // avatar[0] if exsist gives a path that multer has uploaded we will get that
// const avatarLocalPath=  req.files?.avatar[0]?.path;
let avatarLocalPath;

if(req.files&& Array.isArray(req.files.avatar)&& req.files.avatar.length>0){
  avatarLocalPath= req.files.avatar[0].path;
}
 let coverImageLocalPath;
 
 if(req.files&& Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
  coverImageLocalPath= req.files.coverImage[0].path;
   
 }
 
 
//  coverimage na dene k baad undefien error aa rha to usko classic if else se dekho bcz hmne avatr check kia bt over image ni

  if(!avatarLocalPath){
    throw new ApiError(400,"avatar file is required")
  }
  
  //5.
    const avatar=await uploadOnClodinary(avatarLocalPath)
    const coverImage=await uploadOnClodinary(coverImageLocalPath );
     
    if(!avatar) {
        throw new ApiError(400,"avatar file is required")
    }

  //6. user baat lkrega db se
   
  const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })
 
   //7. recheck user created or not
 const createdUser=await User.findById(user._id).select("-password -refreshToken")

 // 8.
 if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
 }

 //9.
  return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered succesfully")
  )


})

// user getting logined
const loginUser=asyncHandler(async(req,res)=>{

  //1.
 const {email,password,username} = req.body;

 //2.
 if(!username || !email){
  if(!username && !email) {
    throw new ApiError(400,"email or username is required ")
  }
}
  //3.
  const user=await User.findOne({
    $or:[{email},{username}]
  })

  //4.
  if(!user) {
    throw new ApiError(404,"user does not exsist")
  }
   // ab jo password user daal rha h vo function m pass hoga
 const isPasswordValid=  await user.isPasswordCorrect(password)

 //5.
 if(!isPasswordValid){
  throw new ApiError(401,"invalid password");
  }
  // access and refresh token ka method bnalia coz baar baar use honge vo

 const {Accesstoken,RefeshToken} =await generateAccessAndRefreshToken(user._id)


 const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

  //6.
  const options={
    httpOnly:true,
    secure:true,
  }

  return res
  .status(200)
  .cookie("accessToken",Accesstoken,options)
  .cookie("refreshToken",RefeshToken,options)
  .json(
    new ApiResponse(200,
      {
      user:loggedInUser,Accesstoken,RefeshToken
      },
      " User logged in successfully"
    )
  
  )

})


// user loggingout
const logout=asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(
  req.user._id,
  {
    // $set:{
    //   refreshToken:undefined
    // }  giving error bcoz of undefined instaed use unset
    $unset:{ // YHE unset ek field m flag lega o bhi feild 1 hogi use unset krdega
      refreshToken:1
    }
  },
  {
    new :true
  }
 )

 const options={
  httpOnly:true,
  secure:true,
}
return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User logged out"))

})
 
// frontend wale ko dene k lie refresh token
const accessRefreshToken=asyncHandler(async(req,res)=>{
  // cokkies se refresh token lelo yua fir mobile se through body
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

  // if not got
  if(!incomingRefreshToken) {
    throw new ApiError(401,"Unauthorized request")
  }

  // verify token
    try {
      const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   
  // db reques
  const user=await User.findById(decodedToken?._id);
  if(!user) {
    throw new ApiError(401,"Invalid Refresh Token")
  }
  // if token is valid match incoming and jo user k pass token are they same or not
  
  if(incomingRefreshToken!== user?. refreshToken)
    throw new ApiError(401,"refresh token is expired and used")
  
  
  // verified h to new generate krdo
  const options={
    httpOnly:true,
    secure:true,
  }
  const {accesstoken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
  
  
  // return response
  return res
  .status(200)
  .cookie("accessToken",accesstoken,options)
  .cookie("refreshToken",newRefreshToken,options)
  .json(new ApiResponse(
  200,
  {accesstoken,refreshToken:newRefreshToken},
  "Refresh token generated successfully"
  )
)
    } catch (error) {
      throw new ApiError(401,error?.message||"invalid refresh token ")
    }

})

// changing current password
const changeCurrentPassword=asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword}=req.body
  // find user logic in text
  const user=await User.findById(req.user?._id)
  // check whether password is correct or not using user method in model m bna h
  const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect) {
    throw new ApiError(400,"old password is incorrect")
  }
  // set new pass
  user.password=newPassword
  // save in db taaki prehook call ho
  await user.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{},"password changed successfully"))
})
         
// get current user
const getCurrentUser=asyncHandler(async(req,res)=>{

  return res
        .status(200)
        .json(200,req.user,"Current User fetched successfully")
})

// update all details
const updateAllDetails=asyncHandler(async(req,res)=>{

  const {fullName, email} = req.body

  if (!fullName || !email) {
      throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set: {
              fullName:fullName,
              email: email
          }
      },
      // got info after updation
      {new: true}
      
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))

})

// updating avatar
const updateUserAvatar=asyncHandler(async(req,res)=>{

  const avatarLocalPath=req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar=uploadOnClodinary(avatarLocalPath)
  if(!avatar.url) {
    throw new ApiError(400, " Error while uploading on avatar")
  }
 const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set: {
             avatar:avatar.url
        }
    },
    // got info after updation
    {new: true}
    
).select("-password")


  return res
  .status(200)
  .json(new ApiResponse(200, user, "Avatar updated successfully"))

})


// updating coverimage
const updateCoverImage=asyncHandler(async(req,res)=>{

  const CoverImagePath=req.file?.path
  if (!CoverImagePath) {
    throw new ApiError(400, "CoverImage file is missing")
  }

  const coverImage=uploadOnClodinary(CoverImagePath)
  
  if(!coverImage.url) {
    throw new ApiError(400, " Error while uploading on coverImage")
  }
 const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set: {
             coverImage:coverImage?.url
        }
    },
    // got info after updation
    {new: true}
    
).select("-password")


  return res
  .status(200)
  .json(new ApiResponse(200, user, "CoverImage updated successfully"))

})



// channel profile details :- pipelines
const getUserChannelProfile=asyncHandler(async(req,res)=>{

     //1.
     const{username}=req.params

     //2.
     if(!username?.trim()) {
      throw new ApiError(400, "Username is required")
     }

     //3.
     const channel=await User.aggregate([
     // first pipeline :-match field 
      {
        $match:{
          username:username?.toLowerCase()
        }
      },// got one document say chai code now find its subscriber
      {
        // getting/finding subscribers
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      
      {
       
        //finding maine kitno ko subscribe kia h
        $lookup:{
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo"
        }

      },

      {
        // add adition filds
        // coutning the subscribers
        $addFields:{
           subscriberCount:{
            $size:"$subscribers"
           },
           subscribedToCount:{
             $size:"$subscribedTo"
           },
           // whther user has subscribed or not
            isSubscribed:{
              $cond:{
                // user logged in to hi h tabhi dekh rhe ki subscribed h ya ni
                if:{$in :[req.user?._id,"$subscribers.subscriber"]},
                then :true,
                else :false
              }
            }
        }
      },
      {
        $project:{
          fullName:1,
          username:1,
          subscriberCount:1,
          subscribedToCount:1,
          isSubscribed:1,
          avatar:1,
          coverImage:1,
          email:1
        }
      }

     ])

     if(!channel) {
      throw new ApiError(404,"channel do not exsist")
     }


     return res
            .status(200)
            .json(
              new ApiResponse(200,channel[0],"user channel fetched successfully")
            )
})


// watch history :- subpipelines
const getWwatchHistory=asyncHandler(async(req,res)=>{
  
  const user=await User.aggregate([
    {
      // step 1 got the user
      $match:{
        _id:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      // got bhaut saare docs from video except owner
      $lookup:{
        // inside user to local field of user
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as: "watchHistory",
        // subpipeline for owner
        pipeline:[
          {
            // inside video to local field of video
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
    // got pura user to vo to ni chaiye to subpipeline usme project use          
              pipeline:[
                {
                  $project:{
                      fullName:1,
                      username:1,
                      avatar:1
                  }
                }
              ]
            }
          },
          // ownwer field m array mila jst to ki frotend wale ko data easy mile we are improving data structure
          {
            $addFields:{
              owner:{
                $first:"$owner"
              }
            }
          }
        ]
      }
        
      }
    
  ])
 
 return res.
 status(200)
 .json(
  new ApiResponse (
    200,
  user[0].watchHistory,
  "User Watch History fetched successfully"
  )
) 

})



export {
  registerUser,
  loginUser,
  logout,
  accessRefreshToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAllDetails,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWwatchHistory
}
