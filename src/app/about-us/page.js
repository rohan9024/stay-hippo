"use client"

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

function page() {
    const [menu, setMenu] = useState(false);

    return (
        <div className="flex flex-col h-screen ">
            <div className="w-screen py-6 px-10 flex justify-between items-center">
                <Link href="/" className={`${raleway.className} text-2xl font-bold cursor-pointer`}>Luna</Link>

                <div className='hidden md:flex justify-center items-center space-x-10'>
                    <Link href="/about-us" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>About Us</Link>
                    <a href="https://www.sagarrchavan.in/courses/475162" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Education</a>
                    <a href="https://www.youtube.com/watch?v=YnQNfrwtEDI&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=22" className={`${poppins.className} hidden md:flex text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Youtube</a>
                    <Link href="/terms-conditions" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
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
                    <a href="https://www.youtube.com/watch?v=YnQNfrwtEDI&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=22" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Youtube</a>
                    <Link href="/terms-conditions" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
                </div>
            )
                :

                (<>

                    <div className='flex flex-col justify-center items-center w-screen  border-t border-gray-800'>

                        <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:mx-64 mx-6 h-[600px]">
                            <h1 className={`${poppins.className} text-5xl font-bold`}>Welcome to Luna!</h1>
                            <h1 className={`${poppins.className} text-md font-normal`}> At the heart of our mission, we strive to simplify and streamline the connection between villa owners and travelers seeking the perfect getaway. Recognizing the unique challenges that villa owners face in the hospitality industry, Luna has developed a robust, hassle-free solution for connecting with potential guests without the time-consuming tasks typically associated with bookings and advertising.</h1>
                        </div>
                        <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] bg-pink-200">
                            <h1 className={`${poppins.className} text-5xl font-bold`}>Our Vision</h1>
                            <h1 className={`${poppins.className} text-md font-normal`}> At the heart of our mission, we strive to simplify and streamline the connection between villa owners and travelers seeking the perfect getaway. Recognizing the unique challenges that villa owners face in the hospitality industry, Luna has developed a robust, hassle-free solution for connecting with potential guests without the time-consuming tasks typically associated with bookings and advertising.</h1>
                        </div>
                        <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] ">
                            <h1 className={`${poppins.className} text-5xl font-bold`}>What We Do</h1>
                            <h1 className={`${poppins.className} text-md font-normal`}>Luna operates at the intersection of technology and personal touch. We utilize both online and offline mediums to gather detailed traveler inquiries, including their preferred destinations, budget, and specific needs. This data is meticulously compiled and directly sent to villa owners as pre-qualified leads, ensuring that every interaction they have is with a potential guest whose requirements match what they offer.

                                Our unique lead generation tool is live, quick, and efficient, cutting through the clutter to deliver only what's relevant. Villa owners receive these leads without the need to engage in time-consuming activities such as:
                                Creating and managing advertisements,
                                Running costly and often ineffective marketing campaigns,
                                Shifting through endless inquiries to find genuine prospects,
                                Wasting time on interactions that do not convert into bookings
                            </h1>
                        </div>
                        <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] bg-pink-200">
                            <h1 className={`${poppins.className} text-5xl font-bold`}>Why Choose Luna?</h1>
                            <h1 className={`${poppins.className} text-md font-normal`}>Choosing Luna means choosing simplicity and efficiency. We are more than just a service; we are a partner in your business growth. By entrusting us with the intricacies of guest acquisition, villa owners can focus more on what they do best—providing an exceptional experience for their guests.

                                Our system not only saves time but also reduces the overhead costs associated with acquiring new guests. With Luna, you no longer need to invest in widespread marketing efforts or spend hours in front of a computer filtering through leads. Instead, you receive streamlined, direct access to a pool of interested travelers, all matched to your villa’s offerings and criteria.
                            </h1>
                        </div>


                        <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] ">
                            <h1 className={`${poppins.className} text-5xl font-bold`}>Join Us</h1>
                            <h1 className={`${poppins.className} text-md font-normal`}>Step into the future of villa bookings with Luna. Let us handle the complexities of lead generation and guest acquisition while you enjoy the benefits of increased bookings and satisfied guests. Connect with us today to learn how Luna can transform your villa into a thriving haven for travelers. Together, let's redefine hospitality and create unforgettable experiences for guests while achieving your business goals with ease.
                            </h1>
                        </div>
                    </div>


                </>)}

        </div>
    );
}

export default page;
