
// import { v2 as cloudinary } from 'cloudinary';


// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// cloudinary.config({
//   cloud_name: 'df5qksnyp',
//   api_key: '568622831788156',
//   api_secret: 'v21IhBC6414tbZhS3Seffc7ImIw',
// });


// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads', 
//     format: async (req, file) => 'jpg', 
//     public_id: (req, file) => file.originalname.split('.')[0], 
//   },
// });

// export const upload = multer({ storage: storage });


// import { v2 as cloudinary } from 'cloudinary';
import pkg from 'cloudinary';
const cloudinary = pkg.v2;

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'df5qksnyp',
  api_key: '568622831788156',
  api_secret: 'v21IhBC6414tbZhS3Seffc7ImIw',
});

// Multer storage with Cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Specify folder name in Cloudinary
    format: async (req, file) => 'jpg', // Specify the format
    public_id: (req, file) => file.originalname.split('.')[0], // File name without extension
  },
});


export const upload = multer({ storage: storage });
