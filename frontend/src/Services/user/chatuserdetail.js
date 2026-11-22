import axiosInstance from '../axiosInstance';

export const getChatUserDetails = async (userId) => {
  try {
    const response = await axiosInstance.post('/chatuserdetail', { id: userId });
    const senderId = response.data.author;
    const user = response.data.user;
    return { user, senderId };
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};
