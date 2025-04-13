import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;


export const loginservice = async (email, password) => {
  try {//http://localhost:5000/api/login  
    const response = await axios.post(`${apiUrl}/login`, { email, password });
    
    
    console.log("Response data:", response.data);

    return response;
  } catch (error) {
    console.log(error);
    throw new Error('Login failed');
  }
}
