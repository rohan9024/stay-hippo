"use client"

import React from 'react'
import VillaNavbar from "../../../components/VillaNavbar";
import VillaMiddle from '../../../components/VillaMiddle';
import VillaFooter from '../../../components/VillaFooter';


function page() {



  return (
    <div className='text-gray-200 bg-black'>
      <VillaNavbar />
      <VillaMiddle />
      <VillaFooter />
    </div>

  )
}

export default page