
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGreaterThan, faChevronDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {logoutfun} from '../Services/auth/logout';

function Settingpage() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const backfun = ()=>{
    navigate(-1);
  }

  const logouthandle = async()=>{
      const response = await logoutfun();
      console.log(response);
      if(response.status === 200){
           
           console.log("logout");
           navigate("/login");
      }
  }
  

  return (
    //gap-x-32 mx-3
    <div className="pt-8 lg:w-[60%] lg:mx-auto lg:pt-24">
      <div className='flex  justify-between w-[64%] px-2 lg:w-[56%]'>
         <FontAwesomeIcon icon={faArrowLeft} className="text-xl mt-2" onClick={backfun}/>
        <h2 className="font-bold text-xl">Settings</h2>
      </div>

      <div className='flex flex-col gap-y-6 pt-12 pl-2 lg:pt-15'>
      <div className="flex justify-between">
        <p className="text-start font-bold">Change Password</p>
        <FontAwesomeIcon icon={faGreaterThan} className='w-[30px]' onClick={()=>{navigate('/forgotpassword')}}/>
      </div>
      
     
      <div>
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setShowPrivacy(!showPrivacy)}
        >
          <p className="text-start font-bold text-gray-700">Privacy Settings</p>
          <FontAwesomeIcon icon={showPrivacy ? faChevronDown : faGreaterThan} className='w-[30px]'/>
        </div>

        {showPrivacy && (
          <ul className="text-start pl-2 mt-2">
            <li>Blocked Connections</li>
            <li>Two-Factor Authentication</li>
          </ul>
        )}
      </div>

     
      <div>
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setShowNotification(!showNotification)}
        >
          <p className="text-start font-bold text-gray-700">Notification Settings</p>
          <FontAwesomeIcon icon={showNotification ? faChevronDown : faGreaterThan} className='w-[30px]'/>
        </div>

        {showNotification && (
          <ul className="text-start pl-2 mt-2">
            <li>Mute Chat</li>
          </ul>
        )}
      </div>
      </div>

     
      <button className="mt-6  text-red-500 font-bold px-4 py-2 rounded " onClick={logouthandle}>Logout</button>
    </div>
  );
}

export default Settingpage;
