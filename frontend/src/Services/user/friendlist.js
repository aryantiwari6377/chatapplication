import axios, { AxiosResponse }  from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export const friendlistservice = async()=>{
try{
    const token = sessionStorage.getItem('token');
    console.log("token is ",token);
    //http://localhost:5000/api/friendslist 
    const response = await axios.get(`${apiUrl}/friendslist`,{
        headers: {
            Authorization: `${token}`, 
          },
    });
    console.log("service res",response);
    return response;
}
catch(error){
     throw new Error("error"+error);
}
}