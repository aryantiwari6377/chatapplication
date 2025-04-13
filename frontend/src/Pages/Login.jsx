import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import messageimg from '../images/3.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { loginservice } from '../Services/auth/login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password should be at least 6 characters').required('Password is required')
});

function Login() {
  const navigate = useNavigate();
  const handleform = async (values) => {
    const { email, password } = values;
  
    try {
      const res = await loginservice(email, password);
  
    
      if (res.status === 200) {
        toast("Login successful!");
        const { token, refreshtoken } = res.data;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshtoken', refreshtoken);
        setTimeout(() => {
          navigate("/check");
        }, 3000);
      }
    } catch (error) {
    
      console.log("Error object: ", error);
  
   
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 401) {
          toast.error(data.message || "Invalid credentials");
        } else if (status === 404) {
          toast.error(data.message || "User not found");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
       
        toast.error("Network error, please try again.");
      } else {
       
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  

  return (
    <div className='overflow-hidden h-[100vh] flex flex-col justify-center lg:flex-row lg:justify-evenly lg:mt-24 lg:w-[80%] h-[100vh]'>
      <div className='h-[260px] w-[90%] md:w-[60%] mx-auto lg:mx-0 lg:w-[36%] lg:h-[300px]'>
        <img src={messageimg} className='h-full w-full' alt="Message"  loading="lazy" />
      </div>

      <div className='lg:pt-16'>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleform}
        >
          {({ isSubmitting }) => (
            <Form className='p-2 flex flex-col gap-y-4 pt-8 px-12 md:w-[60%] md:mx-auto lg:w-auto'>   
              <div className='flex items-center'>
                <FontAwesomeIcon icon={faEnvelope} />
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className='ml-2 outline-none'
                />
              </div>
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />

              <div className='flex items-center'>
                <FontAwesomeIcon icon={faLock} />
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className='ml-2 outline-none'
                />
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />

              <p className='text-[14px] w-[76%] text-end lg:w-[92%]'>
                <Link to="/forgotpassword">Forgot password?</Link>
              </p>

              <button
                type="submit"
                className='bg-[rgb(1,196,246)] w-[70px] my-0.5 text-white rounded-md mx-auto'
                disabled={isSubmitting}
              >
                Login
              </button>
             
                
              <p className='text-sm'>
                Don't have an account? <span className='text-[rgb(1,196,246)]'>
                  <Link to="/signup">Sign up</Link>
                </span>
              </p>
            </Form>
          )}
        </Formik>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
