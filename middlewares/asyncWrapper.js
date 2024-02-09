module.exports = (asyncFn) =>{
    return (req,res,next)=>{
        asyncFn(req,res,next).catch((err)=>{
            next(err);
        })
    }
}




// return (req,res,next)=>{
//     asyncFn(req,res,next){
//         try{
//             await next();
//         }catch(err){
//             if(err instanceof AppError){
//                 res.status(err.statusCode).json({status: err.statusText, message: err.message});
//             }else{
//                 res.status(500).json({status: httpStatusText.ERROR, message: err.message});
//             }
//         }
//     }
//  }