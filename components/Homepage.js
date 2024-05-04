import React from 'react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});

function Homepage() {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-screen py-6 px-10 flex justify-between items-center">
                <Link href="/" className={`${poppins.className} text-lg font-medium cursor-pointer`}>Stay Hippo</Link>
            </div>
            <div className="bg-gray-300 h-[1px]" />
            <div className="flex flex-col justify-center items-center flex-grow space-y-10">
                <h1 className={`${poppins.className} text-3xl font-bold`}>Select one to proceed</h1>
                <div className="flex justify-center items-center space-x-10">
                    <Link href="/admin-login" className="border border-gray-900 shadow-lg px-10 py-2 cursor-pointer hover:ease-in transition hover:bg-gray-200">
                        <h1 className={`${poppins.className} text-lg font-medium cursor-pointer rounded-2xl`}>Admin Login</h1>
                    </Link>
                    <Link href="/villa-login" className="border border-gray-900 shadow-lg px-10 py-2 cursor-pointer hover:ease-in transition hover:bg-gray-200">
                        <h1 className={`${poppins.className} text-lg font-medium cursor-pointer rounded-2xl`}>Villa Login</h1>
                    </Link>
                </div>
            </div>
            <div className="w-screen py-4 flex justify-center items-center bg-gray-200">
                <div className="flex flex-col items-center">
                    <h1 className={`${poppins.className} text-md font-medium`}>Copyright © 2024, Stay Hippo, All rights reserved.</h1>
                    <h1 className={`${poppins.className} text-sm font-medium`}>For any queries, Contact: +919619128258.</h1>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
