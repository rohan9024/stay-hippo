import React, { useContext, useEffect, useState } from 'react'
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';

const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});


function VillaNavbar() {

    const { villa, setVilla } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {

        const isVilla = localStorage.getItem("isVilla") === "true" || '';

        if (!isVilla) {
            router.push('villa-login');
        }
    }, [])

    return (
        <>
            <div class="w-screen py-6 px-10 flex justify-between items-center">
                <Link href="/" class={`${poppins.className} text-lg font-medium cursor-pointer`}>Stay Hippo</Link>
                <div class="flex justify-center items-center space-x-10">
                    <Link href="/villa-panel" class={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Villa Panel</Link>
                    <div onClick={() => {
                        router.push('/villa-login');
                        if (typeof window !== 'undefined') {
                            localStorage.setItem("isVilla", "false") || ''
                        }
                        setVilla(null)
                    }}>
                        <div class={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>
                            <h1>Logout</h1>
                        </div>
                    </div>

                </div>
            </div>
            <div className='bg-gray-300 h-[1px] ' />


        </>

    )
}

export default VillaNavbar