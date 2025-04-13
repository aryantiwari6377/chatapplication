import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { addfriendservice } from '../../src/Services/user/addfriend';
import addfriend from '../../src/images/addfriend.jpg';
import addfriend1 from '../../src/images/addfriend2.jpg';

const Addfriend = ({ addpage, addfriendclose }) => {
  const [email, setEmail] = useState("");

  if (!addpage) return null;

  const handlefriend = async (e) => {
    e.preventDefault(); 
    await addfriendservice(email);
    addfriendclose();
  };

  return (
    <div className="fixed inset-0 px-6">
      <div className="font-bold bg-[rgb(132,196,203)] h-[260px] mx-auto rounded-[16px] w-[230px]  sm:w-[40%] mt-16 pt-3 lg:w-[40%] lg:h-[80%]">
        
      <div className="text-end mr-4">
          <FontAwesomeIcon 
            icon={faXmark} 
            className="font-bold text-xl cursor-pointer" 
            onClick={addfriendclose} 
          />
        </div>
         <img src={addfriend } className=' md:block h-[40%] md:h-[50%] w-[50%] mx-auto'/>
        
        <form className="flex flex-col pt-6 md:pt-6 lg:pt-8" onSubmit={handlefriend}>
          <input 
            type="email" 
            placeholder="Enter email" 
            className="outline-none rounded-full text-black px-2 h-[24px]  w-[190px] mx-auto md:h-[30px] lg:w-[240px]" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button 
            type="submit" 
            className="bg-[#566696] w-[100px] rounded-md py-1 my-3 mx-auto lg:mt-6 lg:h-[40px] lg:py-2 lg:w-[120px]"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addfriend;
