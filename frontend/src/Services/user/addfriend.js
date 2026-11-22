import axiosInstance from '../axiosInstance';

export const addfriendservice = async (email) => {
  try {
    const response = await axiosInstance.post('/addfriend', { email });
    return response;
  } catch (error) {
    throw error;
  }
};
