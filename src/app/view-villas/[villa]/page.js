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
    const [editModal, setEditModal] = useState(false);
    const [villa, setVilla] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [fetch, setFetch] = useState(false);
    const [allocationModal, setAllocationModal] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const searchParams = useSearchParams()

    const groupName = searchParams.get('groupName')
    const groupID = searchParams.get('groupID')
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




    const [allVillasObj, setAllVillasObj] = useState([])

    useEffect(() => {
        if (!fetch) {
            const fetchVillaObj = async () => {
                const querySnapshot = await getDocs(collection(db, "villas"));
                const fetchedVillas = [{
                    id: 1, name: "N/A", group: "N/A"
                }];


                querySnapshot.forEach((doc) => {
                    fetchedVillas.push({ id: doc.id, name: doc.data().name, group: doc.data().group });
                });

                setAllVillasObj(fetchedVillas);
                setFetch(true);
            }

            fetchVillaObj();
        }
    }, [fetch]);


    const handleVillaDropdown = (event) => {
        setVilla(event.target.value);
    };

    async function villaAllocation() {
        // Find and then delete

        const q = query(
            collection(db, "villas"),
            where("name", "==", villa),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Not found");
        } else {
            let villaID;

            querySnapshot.forEach((doc) => {
                villaID = doc.id
            });
            const docRef = doc(db, "villas", villaID);

            try {
                await updateDoc(docRef, {
                    group: groupName,
                });

                alert('Allocated the Villa Successfully');
                window.location.reload();
            } catch (error) {
                alert('Unable to update');
            }
        }

    }

    async function deleteAllocation(villa) {
        await deleteDoc(doc(db, "villas", villa.id));
        window.location.reload();
    }

    return (
        <>
            <Navbar />

            {
                allocationModal && (
                    <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
                        <div className="w-full max-w-2xl bg-black rounded-lg shadow ">
                            <div class="relative bg-black rounded-lg shadow ">
                                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                                    <h3 class="text-xl font-semibold text-gray-200 ">
                                        Create New Allocation
                                    </h3>
                                    <button onClick={() => setAllocationModal(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5 text-gray-200'>

                                    <h1 className={`${poppins.className} text-lg font-bold mt-3 text-gray-200`}>Select Villa</h1>

                                    <select
                                        value={villa}
                                        onChange={handleVillaDropdown}
                                        className="block w-96 py-2 px-5 leading-tight border border-gray-900 bg-black text-white focus:outline-none cursor-pointer"
                                    >
                                        {allVillasObj.map((villa, index) => (
                                            <option key={index} value={villa.name}>
                                                {villa.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div type="submit" onClick={() => villaAllocation()} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-gray-200 border-2 border-gray-800 rounded-full hover:text-gray-900 group hover:bg-gray-900">
                                        <span class="absolute left-0 block w-full h-0 transition-all bg-white opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
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
                        <div className="w-full max-w-2xl bg-black rounded-lg shadow ">
                            <div class="relative bg-black rounded-lg ">
                                <div class="flex items-start justify-between p-4 border-b border-gray-800  rounded-t ">
                                    <h3 class="text-xl font-semibold text-gray-200 ">
                                        Delete Allocation
                                    </h3>
                                    <button onClick={() => setDeleteModal(null)} type="button" class="text-gray-200 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className='flex flex-col justify-center items-center  space-y-5 mb-20  mx-12 my-10'>
                                    <h1 className={`${poppins.className} text-lg font-medium text-gray-200`}>Are you sure?</h1>
                                    <div className='flex justify-start items-center space-x-10'>
                                        <h1 onClick={() => deleteAllocation(deleteModal)} className='px-5 py-2  bg-red-700 text-white cursor-pointer rounded-lg'>Yes</h1>
                                        <h1 onClick={() => setDeleteModal(null)} className='px-5 py-2  bg-gray-700 text-white cursor-pointer rounded-lg'>No</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className='px-10 md:px-28 pt-10 bg-black text-gray-200'>
                <div className={`${poppins.className} flex justify-start items-center space-x-2 pb-10 `}>
                    <img src='/back.png' alt="back" className='w-5 h-5 ' />
                    <Link href="/view-villas" className='text-lg text-gray-200 cursor-pointer hover:ease-in transition  hover:text-gray-200'>Back</Link>
                </div>
                <div className={`${poppins.className} flex justify-between items-center`}>
                    <h1 className='text-2xl lg:text-4xl font-semibold tracking-wide text-gray-200'>{params.groupName}</h1>


                    <div class="flex justify-center items-center space-x-5">
                        <div className='flex justify-center items-center px-5 py-2 bg-black border border-gray-800  rounded-lg text-gray-200 cursor-pointer' onClick={() => setAllocationModal(true)}>
                            <h1 class={`${poppins.className} text-md  `}>Create New Allocation</h1>
                        </div>
                    </div>
                </div>
                <div class={`${poppins.className} relative overflow-x-auto mt-10`}>
                    <table class="w-full text-sm text-left text-gray-200 ">
                        <thead class="text-md text-gray-200  bg-black border border-gray-800   ">
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
                                    <tr class="bg-black border border-gray-800  ">
                                        <th scope="row" class="w-24 px-6 py-4 text-center font-medium text-gray-200 whitespace-nowrap ">
                                            <h1>{count++}</h1>
                                        </th>
                                        <td class="px-6 py-4">
                                            <h1 className='truncate w-56'>{villa.name}</h1>
                                        </td>

                                        <td class="px-6 py-4">
                                            <div className='flex justify-around items-center w-[250px] space-x-4'>
                                                <div onClick={() => setDeleteModal(villa)} className=' w-32 flex justify-around items-center cursor-pointer' >
                                                    <img src='/delete.png' alt="remove" className='w-5 h-5 ' />
                                                    <h1>Delete Record</h1>
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
