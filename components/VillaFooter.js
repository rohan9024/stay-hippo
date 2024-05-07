import { Poppins } from 'next/font/google';
import React from 'react'


const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});
function VillaFooter() {
    return (
        <div class="w-screen py-4 flex justify-center items-center  border-t border-gray-900  bottom-0 fixed">
            {/* <h1 class={`${poppins.className} text-lg font-bold `}>Copyright © 2024, Luna, All rights reserved. </h1> */}
            <div className='flex justify-center items-center space-x-4 mt-3'>
                <h1 className={`${poppins.className} text-sm font-medium`}>For any queries,</h1>
                <div class=" cursor-pointer flex items-center " >
                    <img src="/whatsapp.svg" alt="whatsapp" className='w-7 h-7' />
                    <h1 className={`${poppins.className} text-sm font-medium ml-1`}> +919619128258.</h1>
                </div>
            </div>
        </div>
    )
}

export default VillaFooter