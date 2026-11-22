import axiosInstance from '../axiosInstance';

export const latestmessageservice = async (friendid) => {
  try {
    const response = await axiosInstance.get('/latestMessage', {
      params: { receiverId: friendid },
    });
    return response;
  } catch (error) {
    console.error('Error fetching latest message:', error);
    throw error;
  }
};
