// const {Mongoclient, MongoClient} = require ("mongodb");
// const url = "mongodb+srv://AbdullahOun:jf5RT9zvwwg9n7h4@auction-project.scmjcyp.mongodb.net/"

// const client = new MongoClient(url);

// const main = async () => {
//     await client.connect();
//     const db = client.db("auction-project");
//     const collection = db.collection("products");
//     const result = await collection.find({}).toArray();
//     console.log(result);
//     // await client.close();
// }




// const mongoose = require('mongoose');
// const url = "mongodb+srv://AbdullahOun:jf5RT9zvwwg9n7h4@auction-project.scmjcyp.mongodb.net/"

// mongoose.connect(url).then(() => {

//     console.log('mongodb connection successful');
    
// })





// const http = require('node:http');
// const server = http.createServer((req, res)=> {
//   res.write('hello')
//   res.end();
// })



// server.listen(4000,()=>{
//     console.log('Server running at http://127.0.0.1:4000/');
// });


























// /const multer = require('multer') ;

// const diskStorage = multer.diskStorage({
//     destination: function (req,file,cb){
//         cb(null,'uploads/')
//     },
//     filename: function (req,file,cb){
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `user-${Date.now()}.${ext}`; ;
//         cb(null,fileName);
//     }
// })

// const fileFilter = (req,file,cb) => {
//     const imageType = file.mimetype.split('/')[0];

//     if(imageType === 'image'){
//         cb(null,true);
//     }else{
//         const error = appError.create('Only images are allowed',400,httpStatusText.FAIL);
//         return cb(error);
//     }



// }


// const upload = multer({
//     storage: diskStorage,
//     fileFilter});




