import React, { useState } from 'react'
import forgot from "../images/forgot.jpg"
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {forgotservice} from '../Services/auth/forgotpassword';
import { useNavigate } from 'react-router-dom';

function Forgotpage() {
        
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleform = async (e) => {
       e.preventDefault(); // prevent page reload
       if (!email.trim()) return;
       setLoading(true);
       setMessage("");
       setError("");
       try {
         const res = await forgotservice(email);
         if (res?.status === 200) {
           setMessage("Password reset link sent! Check your email.");
         }
       } catch (err) {
         const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
         setError(msg);
       } finally {
         setLoading(false);
       }
    }


  return (
    <div className=' md:mx-20  md:mt-6 lg:w-[1200px]'>
         <div className='text-end'>
          <FontAwesomeIcon icon={faXmark} className='text-xl pr-2 pt-4 font-bold cursor-pointer lg:pr-[100px]' onClick={() => navigate(-1)}/>
        </div>
        <div className='md:flex md:justify-evenly'>
                 <div className='lg:w-[50%]'> <div className='w-[300px] h-[260px] mx-auto lg:w-[85%] lg:h-[360px]'><img src={forgot} className='h-full w-full'/></div>
                     <h2 className='text-[rgb(33,56,88)] font-bold lg:text-xl'>Forgot your password?</h2>
                   </div>
                    
            <form className='w-[64%] md:w-[40%] mx-auto mt-16 md:pt-32' onSubmit={handleform}>
                <div className='flex flex-col gap-3  md:px-4 md:py-10 w-full md:w-[70%] md:h-[80%]'>
                    <input type="email" className="outline-none font-bold " placeholder='Enter the email' onChange={(e)=>{setEmail(e.target.value)}}/>
                    {message && <p className="text-green-600 text-sm font-medium">{message}</p>}
                    {error   && <p className="text-red-500 text-sm font-medium">{error}</p>}
                    <button
                      className='text-white bg-[rgb(33,56,88)] p-1 font-bold rounded-md mt-3 w-[60px] mx-auto md:w-[120px] md:py-2 md:text-[17px] disabled:opacity-50'
                      disabled={loading}
                    >
                      {loading ? 'Sending…' : 'Submit'}
                    </button>
                </div>
            </form>
            </div>
    </div>
  )
}

export default Forgotpage