import React, { useState } from 'react'
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

function Navbar() {

    return (
        <>
            <div class="w-screen py-6 px-10 flex justify-between items-center ">
            <Link href="/" className={`${raleway.className} text-2xl font-bold cursor-pointer`}>Luna</Link>
                <div class="flex justify-center items-center space-x-10">
                    <Link href="/admin-panel" class={`${poppins.className} text-sm font-medium cursor-pointer  hover:text-gray-400`}>Admin Panel</Link>
                    <Link href="/create-blogs" class={`${poppins.className} text-sm font-medium cursor-pointer  hover:text-gray-400`}>Create Blogs</Link>
                    <Link href="/create-bookings" class={`${poppins.className} text-sm font-medium cursor-pointer   hover:text-gray-400`}>Create Enquiry</Link>
                    <Link href="/view-bookings" class={`${poppins.className} text-sm font-medium cursor-pointer   hover:text-gray-400`}>View Enquiries</Link>
                    <Link href="/blacklisted" class={`${poppins.className} text-sm font-medium cursor-pointer   hover:text-gray-400`}>BlackListed</Link>
                    <Link href="/view-villas" class={`${poppins.className} text-sm font-medium cursor-pointer  hover:text-gray-400`}>View Villas</Link>
                    <Link href="/profile" class={`${poppins.className} text-sm font-medium cursor-pointer  hover:text-gray-400`}>Profile</Link>
                </div>
            </div>
            <div className='bg-gray-900 h-[1px] ' />


        </>

    )
}

export default Navbar