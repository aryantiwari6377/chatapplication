import axiosInstance from '../axiosInstance';

export const getrequestservice = async () => {
  try {
    const response = await axiosInstance.get('/getrequest');
    return response;
  } catch (error) {
    console.error('Error fetching request service:', error);
    throw error;
  }
};
