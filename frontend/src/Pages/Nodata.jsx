import React, { useState } from 'react';
import commingsoon from '../images/commingsoon.jpg';
import Navbar from '../Components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronLeft, faChevronRight, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Nodata() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleClose = () => {
    navigate('/check');
  };

  return (
    <div className="bg-[rgba(27,32,38,255)] text-white text-sm min-h-screen md:flex">
      <div className="md:flex md:w-[100%]">
        {/* Sidebar Container */}
        <div className={`relative ${isSidebarExpanded ? "md:w-[20%]" : "md:w-[8%]"}`}>
          {/* <div
            className='hidden md:block absolute w-[18px] h-[34px] bg-[rgb(56,59,68)] cursor-pointer flex items-center justify-center rounded-tl-[7.5px] rounded-bl-[7.5px] right-0 top-16 text-white text-lg font-semi-bold z-20'
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronRight} />}
          </div> */}
          <Navbar isSidebarExpanded={isSidebarExpanded} setisSidebarExpanded={setIsSidebarExpanded} />
        </div>

        {/* Main Content Area */}
        <div className={`${isSidebarExpanded ? "md:w-[80%]" : "md:w-[92%]"} md:border-l-2 md:border-[rgb(85,95,94)] min-h-screen flex flex-col`}>
          {/* Header */}
          <div className="flex justify-between items-center py-4 px-6 bg-[rgba(56,59,68,255)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(41,45,54,255)] flex items-center justify-center">
                <FontAwesomeIcon icon={faUserGroup} className="text-[rgba(192,52,48,255)] text-lg" />
              </div>
              <h2 className="font-bold text-xl text-white">Groups</h2>
            </div>
            {/* Close / Cross Icon */}
            <div
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-[rgba(41,45,54,255)] flex items-center justify-center cursor-pointer hover:bg-[rgba(192,52,48,255)] transition"
              title="Close and return to chats"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl text-white" />
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-[rgba(41,45,54,255)] border border-[rgba(56,59,68,255)] rounded-2xl p-8 max-w-md flex flex-col items-center shadow-2xl">
              <div className="w-48 h-48 rounded-xl overflow-hidden mb-6 border border-gray-700 bg-black/40 flex items-center justify-center">
                <img src={commingsoon} alt="Coming Soon" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Group Chats Coming Soon! 🚀</h3>
              <p className="text-gray-400 text-sm mb-6">
                We're currently building group conversations, shared media channels, and group video calls. Stay tuned for the upcoming update!
              </p>
              <button
                onClick={handleClose}
                className="bg-[rgba(192,52,48,255)] hover:bg-[#a02a26] text-white font-semibold px-6 py-2.5 rounded-full transition shadow-lg"
              >
                Back to Chats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nodata;
