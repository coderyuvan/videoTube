import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema=new  Schema({
   
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },

    email:{
        type:String, 
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },

   fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },

    avatar:{
        type:String,// cloudinary url isme video yhe sb files uploqd krkr ek url aata h
        required:true,
    },

    coverImage:{
        type:String,
    },


    watchHistory:[
        {
        type: Schema.Types.ObjectId,
        ref:"Video",
        }
    ],
    
    password:{
        type:String,// standard practice 
        required:[true, 'Password is required']
    },

    refreshToken:{
        type:String,

    }

},{timestamps:true})


//  write a pre hook to check / execute a pice of code  jst before execution of main code go on middleeware in mongoose docs

userSchema.pre("save",async function(next) {
    // hr baar password ni encrypt krna jb pass word bheju tbhi krna else no
    if(!this.isModified("password")){
       return next();
    }
    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    // bcrypt compare krega user k password or encrypted passowrd ko ki same h ya nhi
  return  await  bcrypt.compare(password,this.password)
}  

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        // PAYLOAD GIVEN INFO TO BE KEPT
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
         // access token 
        process.env.ACCESS_TOKEN_SECRET,

        // expiry goes in object
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    // yhe baar baar refresh hota h usme info km hoti h
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema);