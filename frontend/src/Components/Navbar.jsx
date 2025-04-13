import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage, } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faGear, faUserGroup } from '@fortawesome/free-solid-svg-icons';

function Navbar({isSidebarExpanded, setisSidebarExpanded}) {
     
  const navigate = useNavigate();
     
  return (
    <div className='fixed bottom-0 w-full md:static'>
         {/* <nav className='flex justify-evenly rounded-full mx-2 py-2 bg-[rgba(56,59,68,255)]'>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]' onClick={()=>navigate("/chatuserpage")}><FontAwesomeIcon icon={faMessage} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] ' onClick={()=>navigate("/notification")}><FontAwesomeIcon icon={faBell} className='text-[rgba(192,52,48,255)] text-xl mt-2' /></div>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] '><FontAwesomeIcon icon={faMessage} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] '><FontAwesomeIcon icon={faMessage} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div>
         </nav> */}
          <nav className='flex justify-evenly rounded-full mx-2 py-2 bg-[rgba(56,59,68,255)] md:hidden'>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)]' onClick={()=>navigate("/check")}><FontAwesomeIcon icon={faMessage} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] ' onClick={()=>navigate("/notification")}><FontAwesomeIcon icon={faBell} className='text-[rgba(192,52,48,255)] text-xl mt-2' /></div>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] '  onClick={()=>navigate("/nodata")}><FontAwesomeIcon icon={faUserGroup} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div>
            <div className='rounded-full w-[40px] h-[40px] bg-[rgba(41,45,54,255)] ' onClick={()=>navigate("/setting")}><FontAwesomeIcon icon={faGear} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div>
         </nav> 
         
         <nav className="cursor-pointer hidden md:flex flex-col  gap-y-8  pt-32 mx-auto md:items-center ">
            {isSidebarExpanded ?  <div className='flex rounded-full gap-x-3 bg-[rgb(56,59,68)] w-[80%] justify-center py-1 cursor-pointer' onClick={()=>navigate("/check")}><div className='bg-[rgba(41,45,54,255)] w-[37px] h-[37px] rounded-full'><FontAwesomeIcon icon={faMessage} className='text-[rgba(192,52,48,255)] text-xl mt-2'/> </div><p className='text-[18px] pt-1'>Messages</p></div>
            :
            <div ><div className='bg-[rgba(41,45,54,255)] w-[37px] h-[37px] rounded-full' onClick={()=>navigate("/check")}><FontAwesomeIcon icon={faMessage}  className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div></div>

               } 
               
               {isSidebarExpanded ?    <div className='flex rounded-full gap-x-3 bg-[rgb(56,59,68)] w-[80%] md:pl-[14%] py-1 cursor-pointer' onClick={()=>navigate("/notification")}><div className='bg-[rgba(41,45,54,255)] w-[37px] h-[37px] rounded-full'><FontAwesomeIcon icon={faBell} className='text-[rgba(192,52,48,255)] text-[18px] mt-2' /></div><p className='text-[18px] pt-1'>Notification</p></div>
                  :
                  <div ><div className='bg-[rgba(41,45,54,255)] w-[37px] h-[37px] rounded-full' onClick={()=>navigate("/notification")}><FontAwesomeIcon icon={faBell} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div></div>
      }

          {isSidebarExpanded ?   <div className='flex rounded-full gap-x-3 bg-[rgb(56,59,68)] w-[80%] justify-center py-1 cursor-pointer' onClick={()=>navigate("/nodata")}><div className='bg-[rgba(41,45,54,255)]  w-[37px] h-[37px] rounded-full' ><FontAwesomeIcon icon={faUserGroup} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div><p className='text-[18px] w-[80px] text-start pt-1'>Group</p></div>
           :
           <div ><div className='bg-[rgba(41,45,54,255)] w-[37px] h-[37px] rounded-full' onClick={()=>navigate("/nodata")}><FontAwesomeIcon icon={faUserGroup} className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div></div> }
         
         
         {isSidebarExpanded ?     <div className='flex rounded-full gap-x-3 bg-[rgb(56,59,68)] w-[80%] justify-center py-1 cursor-pointer' onClick={()=>navigate("/setting")}><div className='bg-[rgba(41,45,54,255)]  w-[37px] h-[37px] rounded-full'><FontAwesomeIcon icon={faGear}  className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div><p className='text-[18px] w-[80px] text-start pt-1'>Setting</p></div>
         :
         <div ><div className='bg-[rgba(41,45,54,255)] w-[37px] h-[37px] rounded-full' onClick={()=>navigate("/setting")}><FontAwesomeIcon icon={faGear}  className='text-[rgba(192,52,48,255)] text-xl mt-2'/></div></div> }
       
       </nav>
    </div>
  )
}
  
export default Navbar