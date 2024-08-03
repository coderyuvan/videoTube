// reuseable code h
import { v2 as cloudinary } from 'cloudinary';
 
 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//   clodanry v same database ki trah h to 

const deleteVideoOnClodinary=async(localFilePath)=>{
try {
    // filepat is not there
    if(!localFilePath) return null;
     
     const response= cloudinary.uploader
    .destroy(localFilePath, {
        resource_type: 'video', type: 'authenticated'
    }
    )
        return true;


} catch (error) {
    // remove locally saved temp filles as the upload operation got failed
    console.error('Error deleting video:', error);
}


}

export {deleteVideoOnClodinary}