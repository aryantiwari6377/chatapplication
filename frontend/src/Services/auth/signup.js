import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


export const signupservice = async (username, email, password) => {
  try {//http://localhost:5000/api/signup 
    const response = await axios.post(`${apiUrl}/signup`, { username, email, password });
    
    
    console.log("Response data:", response);

    return response;
  } catch (error) {
    console.log(error);
    throw new Error('account not created');
  }
}