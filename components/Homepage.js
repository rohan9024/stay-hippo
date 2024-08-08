"use client"

import React, { useContext, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { Inter, Poppins, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../contexts/AuthContext"
import Link from "next/link"
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

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



function Homepage() {
    const [menu, setMenu] = useState(false);
    const router = useRouter();
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [passwordShown, setPasswordShown] = useState(false)

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
        <div className="flex flex-col h-screen ">
            <div className="w-screen py-6 px-10 flex justify-between items-center">
                <Link href="/" className={`${raleway.className} text-2xl font-bold cursor-pointer`}>Luna</Link>

                <div className='hidden md:flex justify-center items-center space-x-10'>
                    <Link href="/about-us" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>About Us</Link>
                    <a href="https://www.sagarrchavan.in/courses/475162" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Education</a>
                    <a href="https://www.youtube.com/watch?v=8OBSI8CNmHY&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=25" className={`${poppins.className} hidden md:flex text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Youtube</a>
                    <Link href="/terms-conditions" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
                    <Link href="/blogs" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Blogs</Link>
                </div>


                <div className='md:hidden '>
                    {menu ? <img src="/close.png" alt="close" className='w-5 h-5' onClick={() => setMenu(false)} /> : <img src="/menu.png" alt="menu" className='w-5 h-5' onClick={() => setMenu(true)} />
                    }
                </div>

            </div>
            <div className="bg-gray-900 h-[1px]" />
            {menu ? (
                <div className='flex flex-col justify-start items-center h-screen my-10 space-y-10 '>
                    <Link href="/about-us" className={`${poppins.className}text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>About Us</Link>
                    <a href="https://www.sagarrchavan.in/courses/475162" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Education</a>
                    <a href="https://www.youtube.com/watch?v=8OBSI8CNmHY&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=25" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Youtube</a>
                    <Link href="/terms-conditions" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
                    <Link href="/blogs" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Blogs</Link>
                </div>
            )
                : (
                    <>

                        <div>
                            <div className='flex flex-col justify-center items-center w-screen h-[485px] my-10 space-y-5 '>
                                <h1 className={`${raleway.className} text-4xl font-bold mb-10`}>Villa Login </h1>
                                <div className='flex flex-col justify-start -ml-10 mb-3'>
                                    <div>
                                        <h1>Username</h1>
                                    </div>
                                    <div>
                                        <input onChange={(e) => { setUsername(e.target.value) }} placeholder='user07' className='ml-0 text-black font-normal mt-2 block w-72 px-4 py-2 bg-white border border-slate-300 rounded-md text-md shadow-md placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 ' type="text" />
                                    </div>
                                </div>
                                <div className='flex flex-col justify-start my-5'>
                                    <div>
                                        <h1>Password</h1>
                                    </div>
                                    <div className="flex items-center ">
                                        <input onChange={(e) => { setPassword(e.target.value) }} placeholder='******' className=' text-black font-normal mt-2 block w-72 px-4 py-2 bg-white border border-slate-300 rounded-md text-md shadow-md placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' type={passwordShown ? 'text' : 'password'} />
                                        <button className='w-5 h-5 object-contain ml-4 '>{passwordShown ? <img onClick={() => setPasswordShown(false)} src="view.png" alt="view" /> : <img onClick={() => setPasswordShown(true)} src="hide.png" alt="hide" />} </button>
                                    </div>
                                </div>

                                <div type="submit" onClick={signIn} disabled={!username || !password} class=" -ml-6 cursor-pointer w-72 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
                                    <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                    <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span class="relative">Submit</span>
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex flex-col justify-center items-center flex-grow space-y-10">
                            <h1 className={`${poppins.className} md:text-3xl text-xl font-bold`}>Select one to proceed</h1>
                            <div className="flex justify-center items-center space-x-10">
                                <Link href="/admin-login" className="border border-gray-900 shadow-lg md:px-10 px-4 py-2 cursor-pointer hover:ease-in transition hover:bg-gray-300">
                                    <h1 className={`${poppins.className} md:text-lg text-md font-medium cursor-pointer rounded-2xl`}>Admin Login</h1>
                                </Link>
                                <Link href="/villa-login" className="border border-gray-900 shadow-lg md:px-10 px-4 py-2 cursor-pointer hover:ease-in transition hover:bg-gray-300">
                                    <h1 className={`${poppins.className} md:text-lg text-md font-medium cursor-pointer rounded-2xl`}>Villa Login</h1>
                                </Link>
                            </div>
                        </div> */}
                        <div className="w-screen md:py-4 py-6 flex justify-center items-center border-t border-gray-900 bottom-0 fixed">
                            <div className="flex flex-col items-center">
                                <h1 className={`${poppins.className} text-md font-medium`}>Copyright © 2024, Luna, All rights reserved.</h1>

                                <div className='flex justify-center items-center space-x-4 mt-3'>
                                    <h1 className={`${poppins.className} text-sm font-medium`}>For any queries,</h1>
                                    <div class=" cursor-pointer flex items-center " >
                                        <img src="/whatsapp.svg" alt="whatsapp" className='w-7 h-7' />
                                        <h1 className={`${poppins.className} text-sm font-medium ml-1`}> +919619128258.</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>


                )
            }
        </div>
    );
}

export default Homepage;
