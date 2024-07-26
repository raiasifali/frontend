import './App.css';
import bg from "./assets/images/loginbg.jpeg";
import logo from "./assets/images/logo.png";
import Switch from "react-switch";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { BASE_URL } from './baseUrl';
function App() {
  const [remember,setRemember] = useState(false)
  const [state,setState]=useState({
    email:'',
    password:''
    
  })
  const handleChange = () =>{
    setRemember(!remember)
  }
  const navigate=useNavigate()

  const loginNow = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/adminLogin`, state);
      console.log(response.data);
      toast.success("Logged in successfully")
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error); 
      } else {
        console.error('Error:', error.message);
        toast.error('Server error. Please try again.'); 
      }
    }
  };

  return (
    <div className="px-[40px]">
       <ToastContainer />
      <div className="max-w-[1440px] mx-auto my-[60px] grid grid-cols-1 lg:grid-cols-2 bg-[#FAFAFB]">
        <div className="w-full relative">
          <img src={bg} alt="bg" className="w-full bg-cover" />
          <span className="w-[120px] absolute top-[20px] left-[20px]">
            <img src={logo} alt="logo" className="w-full" />
          </span>
        </div>
        <div className="w-full lg:m-0 mt-[20px] flex">
          <div className="m-auto">
            <h2 className="text-[26px] text-[#F33] font-bold">Welcome Back</h2>
            <h3 className="text-[16px]">Enter your email and password to sign in</h3>
            <div className="flex flex-col gap-[25px] mt-[20px]">
              <div>
                <label className="block text-[14px] mb-[8px]">Email</label>
                <div className="relative">
                  <input
                  value={state.email}
                  onChange={(e)=>{
                    setState({
                      ...state,
                      email:e.target.value
                    })
                  }}
                    type="email"
                    placeholder="Email"
                    className="w-full p-[15px] pl-[45px] pr-[25px] rounded-[10px] border border-gray-300"
                  />
                  <span className="absolute top-[50%] left-[15px] transform -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.294 7.29105C17.294 10.2281 14.9391 12.5831 12 12.5831C9.0619 12.5831 6.70601 10.2281 6.70601 7.29105C6.70601 4.35402 9.0619 2 12 2C14.9391 2 17.294 4.35402 17.294 7.29105ZM12 22C7.66237 22 4 21.295 4 18.575C4 15.8539 7.68538 15.1739 12 15.1739C16.3386 15.1739 20 15.8789 20 18.599C20 21.32 16.3146 22 12 22Z" fill="#898989" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[14px] mb-[8px]">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={state.password}
                    onChange={(e)=>{
                      setState({
                        ...state,
                        password:e.target.value
                      })
                    }}
                    placeholder="Password"
                    className="w-full p-[15px] pl-[45px] pr-[25px] rounded-[10px] border border-gray-300"
                  />
                  <span className="absolute top-[50%] left-[15px] transform -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.5227 7.39601V8.92935C19.2451 9.46696 20.5 11.0261 20.5 12.8884V17.8253C20.5 20.1308 18.5886 22 16.2322 22H7.7688C5.41136 22 3.5 20.1308 3.5 17.8253V12.8884C3.5 11.0261 4.75595 9.46696 6.47729 8.92935V7.39601C6.48745 4.41479 8.95667 2 11.9848 2C15.0535 2 17.5227 4.41479 17.5227 7.39601ZM12.0051 3.73904C14.0678 3.73904 15.7445 5.37871 15.7445 7.39601V8.7137H8.25553V7.37613C8.26569 5.36878 9.94232 3.73904 12.0051 3.73904ZM12.8891 16.4549C12.8891 16.9419 12.4928 17.3294 11.9949 17.3294C11.5072 17.3294 11.1109 16.9419 11.1109 16.4549V14.2488C11.1109 13.7718 11.5072 13.3843 11.9949 13.3843C12.4928 13.3843 12.8891 13.7718 12.8891 14.2488V16.4549Z" fill="#898989" />
                    </svg>
                  </span>
                </div>
              </div>
              <Switch onChange={handleChange} checked={remember} onColor="#f33" uncheckedIcon={false} checkedIcon={false }/>
              <button onClick={loginNow} className="w-full mt-[20px] bg-[#F33] text-white py-[15px] rounded-[10px] font-bold">Log In</button>
              
              <Link to='/register'>
              <label className="cursor-pointer block text-[14px] mb-[8px]">Don't have an account?</label>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
