import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const  profileservice = async()=>{
      const token = sessionStorage.getItem('token');
      console.log(token);
      //http://localhost:5000/api/profiledata 
      const res = await axios.get(`${apiUrl}/profiledata`,{ 
        headers: {
          Authorization: `${token}`, 
      },
      });
    //   console.log("res is",res);
      return res.data;
    }