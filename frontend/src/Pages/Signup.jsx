// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
// import { faLock } from '@fortawesome/free-solid-svg-icons';
// import img2 from '../images/3.jpg';

// import { Link } from 'react-router-dom';
// import {signupservice} from '../Services/auth/signup.js';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function Signup() {

//          const [username, setUsername] = useState("");
//          const [email, setEmail] = useState("");
//          const [password, setPassword] = useState("");
         
//          const handleform = async(e) => {
//           e.preventDefault(); 
//           const res =  await signupservice(username, email, password);
//           console.log("res is",res);
//            if(res === 201){
//             toast("account created");
//            }
           
//          }

//   return (
//     <div className='flex flex-col gap-y-4 lg:justify-evenly  lg:mt-24 lg:flex-row lg:w-[80%]'>

//         <div className='h-[260px] w-[90%] mx-auto md:w-[60%] lg:mx-0 lg:w-[36%] lg:h-[300px]'>
//         <img src={img2} className='h-full w-full'/>
//        </div> 

//       <form className='p-2 flex flex-col gap-y-6 pt-16' onSubmit={handleform}>

//         <div>
//         <FontAwesomeIcon icon={faUser}/>
//           <input type="text" placeholder="Username" className='outline-none ml-1' onChange={(e)=>{setUsername(e.target.value);}}/>
//         </div>

//         <div>    
//         <FontAwesomeIcon icon={faEnvelope}/>
//           <input type="email" placeholder="Email" className='outline-none ml-1' onChange={(e)=>{setEmail(e.target.value);}}/>
//         </div>

//         <div>
//         <FontAwesomeIcon icon={faLock}/>
//           <input type="password" placeholder="Password" className='outline-none ml-1' onChange={(e)=>{setPassword(e.target.value);}}/>
//         </div>

//         <button type="submit" className="bg-[rgb(1,196,246)] w-[70px] py-1 text-white rounded-md mx-auto">Sign Up</button>
//         <p >Already have an account? <span className="text-[rgb(1,196,246)]"><Link to="/login">Login</Link></span></p>
//       </form>
//       <ToastContainer/>
//     </div>
//   );
// }

// export default Signup;

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import img2 from '../images/3.jpg';
import { Link } from 'react-router-dom';
import { signupservice } from '../Services/auth/signup.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleform = async (e) => {
     
    e.preventDefault();
    
     if(password.length < 6){
       toast("minimum 6 leangth password is required");
       return;
     }

    const res = await signupservice(username, email, password);
    console.log('res is', res); 

    if (res.status === 201) {
      toast.success('Account created successfully!');
      navigate("/login");
    } else {
      toast.error('Something went wrong!');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col justify-center gap-y-4 overflow-hidden h-[100vh] lg:justify-evenly lg:mt-24 lg:flex-row lg:w-[80%]'>
        <div className='h-[240px] w-[90%] mx-auto md:w-[60%] lg:mx-0 lg:w-[36%] lg:h-[300px]'>
          <img src={img2} className='h-full w-full' />
        </div>

        <form className='p-2 flex flex-col gap-y-6 pt-16' onSubmit={handleform}>
          <div>
            <FontAwesomeIcon icon={faUser} />
            <input
              type='text'
              placeholder='Username'
              className='outline-none ml-2'
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type='email'
              placeholder='Email'
              className='outline-none ml-2'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <FontAwesomeIcon icon={faLock} />
            <input
              type='password'
              placeholder='Password'
              className='outline-none ml-2'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type='submit' className='bg-[rgb(1,196,246)] w-[70px] py-1 text-white rounded-md mx-auto'>
            Sign Up
          </button>
          <p>
            Already have an account?{' '}
            <span className='text-[rgb(1,196,246)]'>
              <Link to='/login'>Login</Link>
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
