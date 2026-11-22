import axiosInstance from '../axiosInstance';

export const friendlistservice = async () => {
  try {
    const response = await axiosInstance.get('/friendslist');
    return response;
  } catch (error) {
    throw new Error('error' + error);
  }
};
