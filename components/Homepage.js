import React, { useState } from 'react';
import { Poppins, Raleway } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});
const raleway = Raleway({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});

function Homepage() {
    const [menu, setMenu] = useState(false);


    return (
        <div className="flex flex-col h-screen ">
            <div className="w-screen py-6 px-10 flex justify-between items-center">
                <Link href="/" className={`${raleway.className} text-2xl font-bold cursor-pointer`}>Luna</Link>

                <div className='hidden md:flex justify-center items-center space-x-10'>
                    <Link href="/about-us" className={`${poppins.className}text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>About Us</Link>
                    <a href="https://www.sagarrchavan.in/courses/475162" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Education</a>
                    <Link href="/terms-conditions" className={`${poppins.className}text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
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
                    <Link href="/terms-conditions" className={`${poppins.className}text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
                </div>
            )

                : (



                    <>
                        <div className="flex flex-col justify-center items-center flex-grow space-y-10">
                            <h1 className={`${poppins.className} md:text-3xl text-xl font-bold`}>Select one to proceed</h1>
                            <div className="flex justify-center items-center space-x-10">
                                <Link href="/admin-login" className="border border-gray-900 shadow-lg md:px-10 px-4 py-2 cursor-pointer hover:ease-in transition hover:bg-gray-300">
                                    <h1 className={`${poppins.className} md:text-lg text-md font-medium cursor-pointer rounded-2xl`}>Admin Login</h1>
                                </Link>
                                <Link href="/villa-login" className="border border-gray-900 shadow-lg md:px-10 px-4 py-2 cursor-pointer hover:ease-in transition hover:bg-gray-300">
                                    <h1 className={`${poppins.className} md:text-lg text-md font-medium cursor-pointer rounded-2xl`}>Villa Login</h1>
                                </Link>
                            </div>
                        </div>
                        <div className="w-screen md:py-4 py-6 flex justify-center items-center border-t border-gray-900 ">
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
