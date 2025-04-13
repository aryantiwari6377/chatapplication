import React, { useState } from 'react'
import {changepaswordservice} from '../Services/auth/changepassword';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import passwordreset from '../images/passwordreset.png';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Passwordresetpage() {
        
      const [newpassword, setPassword] = useState("");
      const [confirmpassword, setConfirmpassword] = useState("");
      const [error, setError] = useState("");
      const navigate = useNavigate();
     const {token} = useParams();
           
          
       const formhandle = async() =>{
        
                     const res = await changepaswordservice(newpassword,token);
                  console.log("res after update password",res);
                  if(res.status === 401){
                    navigate("/login");
                  }
                  if(res.status===200){
                      alert("password updated");
                      navigate("/login");
                  }
       }

  return (
   <div className='relative flex flex-col justify-center items-center md:mt-10'>
          
            <div className='absolute right-6 lg:right-12 top-1'>
                     <FontAwesomeIcon icon={faXmark} className='text-xl pr-2 pt-4 font-bold cursor-pointer' onClick={() => navigate(-1)}/>
                   </div>
          <div>
            <img src={passwordreset} alt="no image"/>
          </div>
          <div>
           <form onSubmit={formhandle} className='h-[200px] flex flex-col  justify-around'>
            <div className='h-[130px] flex flex-col justify-evenly'>
             <div className='pl-3 flex gap-x-8 justify-evenly text-sm h-[30px]'>
            {/* <label className='pt-[4px]'>New password:</label> */}
            <input placeholder='password' className=' outline-none' onChange={(e)=>{setPassword(e.target.value)}}/>
            
            </div>

            <div className='pl-1 flex gap-x-8 justify-evenly text-sm h-[30px]'>
            {/* <label className='pt-[4px]'>Confirm Password:</label>    */}
            <input placeholder='confirm password' className='pl-2 outline-none' onChange={(e)=>{setConfirmpassword(e.target.value)}}/>
            </div>
            </div>
            <button className='bg-[rgb(33,56,88)] mx-auto font-bold w-[60px] md:w-[120px] text-[#FFFFFF] py-2 rounded-md'>Reset</button>
               
           </form>
           </div>
    </div>
  )
}

export default Passwordresetpage