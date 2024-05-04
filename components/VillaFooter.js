import { Poppins } from 'next/font/google';
import React from 'react'


const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
  });
function VillaFooter() {
    return (
        <div class="w-screen py-4 flex justify-center items-center bg-black border-t border-gray-900 text-gray-200 bottom-0 fixed">
            {/* <h1 class={`${poppins.className} text-lg font-bold `}>Copyright © 2024, Stay Hippo, All rights reserved. </h1> */}
            <h1 class={`${poppins.className} text-md font-medium `}>For any queries, Contact: +919619128258. </h1>
        </div>
    )
}

export default VillaFooter