import axiosInstance from '../axiosInstance';

export const allmessageservice = async (id, senderid) => {
  try {
    const response = await axiosInstance.get('/allmessages', {
      params: { id, senderid },
    });
    return response;
  } catch (error) {
    throw new Error('Network response was not ok: ' + error);
  }
};
