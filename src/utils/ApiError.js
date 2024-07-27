// jb v hm error bheje to yhe na ho ki ek cheez bhej rhe
// ek nhi to standard error filr ki class bnali using node js hr baar isi format m error jaayega alwawys

class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ){
      super(message)
      this.statusCode=statusCode
      this.data=null // read this.data field
      this.errors=errors
      this.message=message
      this.success=false;

      if(stack){
        this.stack=stack
      } else{
        Error.captureStackTrace(this,this.constructor)
      }

    }
}

export {ApiError}