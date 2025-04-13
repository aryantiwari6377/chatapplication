

// import dotenv from 'dotenv';
// import express from 'express';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary'; 
// import usermodel from '../../models/usermodel.js';

// dotenv.config();


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });


// // Route for handling profile image upload

// export const uploadprofile = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

// //   try {
// //     // Upload image to Cloudinary
// //     const result = await cloudinary.uploader.upload_stream(
// //       { folder: 'profile_images' },
// //       async (error, result) => {
// //         if (error) {
// //           return res.status(500).json({ error: 'Upload failed', details: error });
// //         }

// //         // Save image URL to MongoDB (Assuming the user ID is passed in the request)
// //         // const userId = req.body.userId; // Pass user ID in the request body
// //         // const user = await usermodel.findById(userId);
// //         console.log(req.body);
// //         if (!user) {
// //           return res.status(404).json({ error: 'User not found' });
// //         }

// //         usermodel.profileImage = result.secure_url; // Store Cloudinary URL in the profileImage field
// //         await usermodel.save();

// //         res.status(200).json({ message: 'Image uploaded and saved successfully', imageUrl: result.secure_url });
// //       }
// //     );

// //     req.file.buffer.pipe(result);
// //   } catch (error) {
// //     console.error('Error uploading image:', error);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Upload the image to Cloudinary
//     const result = await cloudinary.uploader.upload_stream(
//       { folder: 'profile_images' },
//       (error, result) => {
//         if (error) {
//           return res.status(500).json({ error: 'Upload to Cloudinary failed', details: error });
//         }

//         return result;
//       }
//     );

//     // const userId = req.user.id; 
//     const user = await usermodel.findById('678a217cd6200b4477c400b3');

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Save Cloudinary URL to MongoDB
//     user.profileImage = result.secure_url;
//     await user.save();

//     res.status(200).json({ message: 'Image uploaded and saved successfully', imageUrl: result.secure_url });
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }