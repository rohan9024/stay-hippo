"use client"

import React, { useContext, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../../components/Navbar';
import { Inter, Poppins, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../../../contexts/AuthContext"
import Link from "next/link"
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

const raleway = Raleway({
  weight: ['400', '700'],
  subsets: ['latin'],
});
const inter = Inter({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
});


function page() {
  const router = useRouter();
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)

  const { villa, setVilla } = useContext(AuthContext);

  const notifySuccess = () => toast.success('Logged in successfully', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  const notifyError = () => toast.error('Invalid username or password', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  const notifyMissingCredentials = () => toast.error('Missing Credentials', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  const notifyMissingUsername = () => toast.error('Please Enter Username', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  const notifyMissingPassword = () => toast.error('Please Enter Password', {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });


  const signIn = async (e) => {
    e.preventDefault();

    if (username && password) {
      const q = query(
        collection(db, "villaAccounts"),
        where("username", "==", username),
        where("password", "==", password)
      );

      const querySnapshot = await getDocs(q);
      let villaName;

      if (querySnapshot.empty) {
        alert("Something went wrong");
      } else {

        querySnapshot.forEach((doc) => {
          setVilla({
            id: doc.id,
            name: doc.data().name,
            location: doc.data().location
          })
          villaName = doc.data().name
        })
        alert("Logged in Successfully");
        if (typeof window !== 'undefined') {
          localStorage.setItem("isVilla", "true") || '';
          localStorage.setItem("villaName", villaName) || '';
        }

        router.push("/villa-panel");
      }
    }
    else if (!username && password) {
      notifyMissingUsername()
    }
    else if (username && !password) {
      notifyMissingPassword()
    }
    else {
      notifyMissingCredentials()
    }
  };






  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div class="w-screen py-6 px-10 flex justify-between items-center ">
      <Link href="/" className={`${raleway.className} text-2xl font-bold cursor-pointer`}>Luna</Link>
      </div>
      <div className='bg-gray-900 h-[1px] ' />
      <div>
        <div className='flex flex-col justify-center items-center w-screen h-screen space-y-5 '>
          <h1 className={`${raleway.className} text-4xl font-bold mb-10`}>Villa Login </h1>
          <form className='flex flex-col justify-center items-center space-y-5 '>
            <input onChange={(e) => setUsername(e.target.value)} required type="text" placeholder="Enter Username" className={`${inter.className} placeholder:text-gray-800 px-5 py-2  outline-none border border-gray-800 w-96 bg-transparent`} />
            <input onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className={`${inter.className} placeholder:text-gray-800 px-5 py-2  outline-none border border-gray-800 w-96 bg-transparent`} />
            <div className='flex justify-between items-center'>
              <h1 className='font-normal text-sm text-right ml-56 text-gray-500'>Forgot your Password?</h1>
            </div>

            <div type="submit" onClick={signIn} disabled={!username || !password} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
              <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span class="relative">Submit</span>
            </div>

          </form>
        </div>
      </div>
    </>

  )
}

export default page