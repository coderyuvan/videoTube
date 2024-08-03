// DB SE HR BAAR baat krni hi h to uska ek utility bna kr rkhlo
// yhe isliye bnaya h taaki hr jgah hr  cheez ko  promise m wrap na krna pde  then catch na lgane pde
const asyncHandler=(requestHandler)=>{
  return (req,res,next)=>{ 
    Promise
    .resolve(requestHandler(req,res,next))
    .catch((err)=> next(err))
 }
}
 
export {asyncHandler}