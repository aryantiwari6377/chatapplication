import React from 'react'
import { Link } from 'react-router-dom'
import start4 from "../images/start4.jpg";
import start2 from "../images/start2.jpg";
import start3 from "../images/start3.jpg";

function Startingpage() {
  return (
    <div className='flex flex-col md:flex-row md:w-[70%] md:mx-auto  md:gap-[10%] md:justify-center mt-8'>
      <div className='md:w-[50%]'>
        <div className='my-6'>
          <h2 className='font-bold text-3xl xl:text-3xl'>Get Started</h2>
          <p className='text-sm xl:text-[16px]'>start with signup or signin</p>
        </div>

        <div className='w-[230px] h-[200px] mx-auto mt-16 xl:w-[310px] xl:h-[290px]'><img src={start4} className='h-full w-full' /></div>
      </div>

      <div className='md:w-[20%] flex flex-col items-center mt-10 md:justify-center '>
        <button className='bg-[rgb(0,100,255)] text-white font-bold rounded-full  w-28 p-1'><Link to='/signup'>Signup</Link></button>
        <button className='bg-[rgb(0,100,255)] text-white font-bold  rounded-full  mt-2  w-28 p-1'><Link to='/login'>Signin</Link></button>
      </div>

    </div>
  )
}

export default Startingpage