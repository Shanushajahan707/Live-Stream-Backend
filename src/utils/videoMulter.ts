import multer from "multer";
// import path from 'path';
// import fs from 'fs';

const videoStorage = multer.memoryStorage()
const singleVideoUpload = multer({ storage: videoStorage })

export default singleVideoUpload

// function getAbsolutePath(relativePath:string):string {
//   return path.resolve(__dirname, relativePath);
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = getAbsolutePath('../public/channelShorts');
//     // Create the directory if it doesn't exist
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// export const uploadshorts = multer({ storage: storage }).single('videofile');


