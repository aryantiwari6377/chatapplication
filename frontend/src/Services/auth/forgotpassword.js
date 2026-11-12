import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const forgotservice = async (email) => {
  // Let the error propagate so the caller can read err.response.data.message
  const response = await axios.post(`${apiUrl}/forgot`, { email });
  return response;
};
