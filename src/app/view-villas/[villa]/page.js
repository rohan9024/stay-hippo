"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Poppins } from 'next/font/google';
import Navbar from '../../../../components/Navbar';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../../../../firebase';

const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});


function GroupProps({ params }) {
    const [timetableObj, setTimetableObj] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [itemsList, setItemsList] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [tabTimetable, setTabTimetable] = useState([]);
    const [fetch, setFetch] = useState(false);
    const [allocationModal, setAllocationModal] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const searchParams = useSearchParams()

    const groupName = searchParams.get('groupName')
    const router = useRouter();


    var count = 1;

    const [villaObj, setVillaObj] = useState([])

    useEffect(() => {
        if (!fetch) {
            async function findVillas() {

                const q = query(
                    collection(db, "villas"),
                    // where("group", "==", "Group 1"),
                    where("group", "==", groupName),
                );

                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    alert("Not found");
                } else {
                    const fetchedVillas = [];

                    querySnapshot.forEach((doc) => {
                        fetchedVillas.push({ id: doc.id, name: doc.data().name, group: doc.data().group });
                    });

                    setVillaObj(fetchedVillas);
                    setFetch(true);
                }
            }

            findVillas()
        }
    }, [fetch])







    return (
        <>
            <Navbar />

            {
                allocationModal && (
                    <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
                        <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
                            <div class="relative bg-white rounded-lg shadow ">
                                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                                    <h3 class="text-xl font-semibold text-gray-900 ">
                                        Create New Allocation
                                    </h3>
                                    <button onClick={() => setAllocationModal(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5'>

                                    <h1 className={`${poppins.className} text-lg font-medium`}>Select Item</h1>

                                    <select
                                        value={inventoryName}
                                        onChange={(event) => {
                                            handleItemDropdown(event);
                                        }}
                                        className="block w-96 py-2 px-5 leading-tight border border-gray-700 focus:outline-none cursor-pointer"
                                    >
                                        {inventoryObj.map((inventory) => (
                                            <option key={inventory.id} value={inventory.item}>
                                                {inventory.item} - {inventory.stock}
                                            </option>
                                        ))}
                                    </select>

                                    <h1 className={`${poppins.className} text-lg font-medium`}>Enter Quantity</h1>

                                    <input
                                        onChange={(e) => setQuantity(e.target.value)}
                                        value={quantity}
                                        type="number"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
                                    />
                                    <div type="submit" onClick={() => itemAllocation()} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
                                        <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                        <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </span>
                                        <span class="relative">Submit</span>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                editModal && (
                    <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
                        <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
                            <div class="relative bg-white rounded-lg shadow ">
                                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                                    <h3 class="text-xl font-semibold text-gray-900 ">
                                        Edit Allocation
                                    </h3>
                                    <button onClick={() => setEditModal(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5'>
                                    <h1 className={`${poppins.className} text-lg font-medium`}>Enter Quantity for {editModal.item}</h1>

                                    <input
                                        onChange={(e) => setQuantity(e.target.value)}
                                        value={quantity}
                                        type="number"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
                                    />
                                    <div type="submit" onClick={() => updateAllocation(quantity, editModal)} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
                                        <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                        <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </span>
                                        <span class="relative">Submit</span>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                deleteModal && (
                    <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
                        <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
                            <div class="relative bg-white rounded-lg ">
                                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                                    <h3 class="text-xl font-semibold text-gray-900 ">
                                        Delete Allocation
                                    </h3>
                                    <button onClick={() => setDeleteModal(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className='flex flex-col justify-center items-center  space-y-5 mb-20  mx-12 my-10'>
                                    <h1 className={`${poppins.className} text-lg font-medium`}>Are you sure?</h1>
                                    <div className='flex justify-start items-center space-x-10'>
                                        <h1 onClick={() => deleteItem(deleteModal)} className='px-5 py-2 border bg-red-700 text-white cursor-pointer'>Yes</h1>
                                        <h1 onClick={() => setDeleteModal(null)} className='px-5 py-2 border bg-gray-700 text-white cursor-pointer'>No</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className='mx-10 md:mx-28 mt-10'>
                <div className={`${poppins.className} flex justify-start items-center space-x-2 pb-10 `}>
                    <img src='/back.png' alt="back" className='w-5 h-5 ' />
                    <Link href="/departments" className='text-lg text-black cursor-pointer hover:ease-in transition  hover:text-gray-400'>Back</Link>
                </div>
                <div className={`${poppins.className} flex justify-between items-center`}>
                    <h1 className='text-2xl lg:text-4xl font-semibold tracking-wide '>{params.groupName}</h1>


                    <div class="flex justify-center items-center space-x-5">
                        <div className='flex justify-center items-center px-5 py-2 bg-black rounded-lg text-white cursor-pointer' onClick={() => setAllocationModal(true)}>
                            <h1 class={`${poppins.className} text-md  `}>Create New Allocation</h1>
                        </div>
                    </div>
                </div>
                <div class={`${poppins.className} relative overflow-x-auto mt-10`}>
                    <table class="w-full text-sm text-left text-gray-500 ">
                        <thead class="text-md text-gray-700  bg-gray-50 border-b  ">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Sr. No.
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Villa Name
                                </th>

                                <th scope="col" class="px-6 py-3">
                                    Options
                                </th>
                            </tr>
                        </thead>
                        {
                            villaObj.map((villa) => (

                                <tbody>
                                    <tr class="bg-white border-b ">
                                        <th scope="row" class="w-24 px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap ">
                                            <h1>{count++}</h1>
                                        </th>
                                        <td class="px-6 py-4">
                                            <h1 className='truncate w-56'>{villa.name}</h1>
                                        </td>

                                        <td class="px-6 py-4">
                                            <div className='flex justify-around items-center w-[250px] space-x-4'>
                                                <div onClick={() => setDeleteModal(stock)} className=' w-32 flex justify-around items-center cursor-pointer' >
                                                    <img src='/delete.png' alt="remove" className='w-5 h-5 ' />
                                                    <h1>Delete Record</h1>
                                                </div>
                                                <div onClick={() => setEditModal(stock)} className=' w-28 flex justify-around items-center cursor-pointer' >
                                                    <img src="/edit.png" alt="edit" className='w-5 h-5' />
                                                    <h1>Edit Record</h1>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        }
                    </table>
                </div>


            </motion.div>
        </>
    );
}

export default GroupProps;
