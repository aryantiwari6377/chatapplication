
// import usermodel from '../../models/usermodel.js';
// // import cloudinary  from '../../util/cloudinary.js';

// export const profileupload =async (req, res) => {

// try {
  
//   const imageUrl = req.file.path;
//   console.log("image url is", imageUrl);

//   const {id} = req.user;
//   const user = await usermodel.findById(id);

//   if(!user){
//     res.status(404).json({ error: 'user not found' });
//   }

//     user.profileimage = imageUrl;
//     await  user.save();


//   res.status(200).json({
//     message: 'Image uploaded and URL stored successfully',
//     url: imageUrl,
//   });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ error: 'Failed to upload image or store URL' });
// }

// };

import usermodel from '../../models/usermodel.js';

export const profileupload = async (req, res) => {
  try {
    // Ensure that the file exists
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Image upload failed or no file provided' });
    }

    // Get the Cloudinary URL from req.file.path
    const imageUrl = req.file.path;
    console.log('Uploaded Image URL:', imageUrl);

    // Get user ID from authenticated user
    const { id } = req.user;
    const user = await usermodel.findById(id);

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    user.profileImage = imageUrl;   
    await user.save();

    // Send success response
    res.status(200).json({
      message: 'Image uploaded and URL stored successfully',
      url: imageUrl,
    });
  } catch (error) {
    console.error('Error during profile upload:', error);
    res.status(500).json({ error: 'Failed to upload image or store URL' });
  }
};
