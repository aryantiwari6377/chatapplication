import axiosInstance from '../axiosInstance';

export const profileservice = async () => {
  const res = await axiosInstance.get('/profiledata');
  return res.data;
};
