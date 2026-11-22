import axiosInstance from '../axiosInstance';

export const requestservice = async (senderId, value) => {
  try {
    const response = await axiosInstance.post('/requestaction', { senderId, value });
    return response;
  } catch (error) {
    console.error('Error in requestservice', error);
    throw error;
  }
};
