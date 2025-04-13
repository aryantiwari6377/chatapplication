import React from 'react'

function Reset() {
  return (
    <div>
       <form className='w-[430px] mx-auto border border-gray-400 border-2 rounded-md p-4 flex flex-col gap-6'>
            <div className='h-[50px]'>
               <input type="password" placeholder="password"/>
            </div>

            <div className='h-[50px]'>
            <input type="password" placeholder="confirm"/>
            </div>
       </form>
    </div>
  )
}

export default Reset