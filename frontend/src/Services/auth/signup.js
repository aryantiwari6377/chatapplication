import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


export const signupservice = async (username, email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/signup`, { username, email, password });
    console.log("Response data:", response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};