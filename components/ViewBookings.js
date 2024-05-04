import React, { useEffect, useState } from 'react';
import { Inter, Poppins } from 'next/font/google';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
});

const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});


function ViewBookings() {
    const [fetch, setFetch] = useState(false)
    const [viewBooking, setViewBooking] = useState(false)
    const [bookingsObj, setBookingsObj] = useState([])



    const [villaObj, setVillaObj] = useState([])


    async function findBookings(villa) {

        const q = query(
            collection(db, "bookings"),
            where("villa", "==", villa.name),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Not found");
        } else {
            const fetchedBookings = [];

            querySnapshot.forEach((doc) => {
                fetchedBookings.push({ id: doc.id, name: doc.data().name, people: doc.data().people, budgetPerPerson: doc.data().budgetPerPerson, contact: doc.data().contact, checkIn: doc.data().checkIn, checkOut: doc.data().checkOut, total: doc.data().total });
            });
            console.log(fetchedBookings)

            setBookingsObj(fetchedBookings);
            setViewBooking(true)
            setFetch(true);
        }
    }



    const [allVillasObj, setAllVillasObj] = useState([])

    useEffect(() => {
        if (!fetch) {
            const fetchVillaObj = async () => {
                const querySnapshot = await getDocs(collection(db, "villas"));
                const fetchedVillas = [];


                querySnapshot.forEach((doc) => {
                    fetchedVillas.push({ id: doc.id, name: doc.data().name, group: doc.data().group });
                });

                setAllVillasObj(fetchedVillas);
                setFetch(true);
            }

            fetchVillaObj();
        }
    }, [fetch]);



    var vcount = 1;
    var bcount = 1;

    
    async function deleteBooking(booking) {
        await deleteDoc(doc(db, "bookings", booking.id));
        window.location.reload();
    }

    return (
        <div className=' flex   bg-black text-gray-200 w-screen h-screen'>

            <div class="w-screen px-32 py-10 flex flex-col ">


                <div class="flex justify-between items-center ">
                    <h1 class={`${poppins.className} text-4xl font-bold `}>Villas List</h1>
                </div>

                <div class={`${poppins.className} relative overflow-x-auto mt-10`}>
                    <table class="w-1/2 text-sm text-left text-gray-500 ">
                        <thead class="text-md text-gray-200  bg-black border border-gray-800  ">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Sr. No.
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Villa
                                </th>

                                <th scope="col" class="px-6 py-3">
                                    Options
                                </th>
                            </tr>
                        </thead>
                        {
                            allVillasObj.map((villa) => (

                                <tbody>
                                    <tr class="bg-black border border-gray-800 ">
                                        <th scope="row" class="w-24 px-6 py-4 text-center font-medium text-gray-200 whitespace-nowrap ">
                                            <h1>{vcount++}</h1>
                                        </th>
                                        <td class="px-6 py-4">
                                            <h1 className='truncate w-36 text-gray-200'>{villa.name}</h1>
                                        </td>

                                        <td class="px-6 py-4">
                                            <div className='flex justify-around items-center w-[100px] space-x-4'>
                                                <div onClick={() => findBookings(villa)} className='hover:text-blue-400 text-blue-600   hover:underline w-32 flex justify-around items-center cursor-pointer' >
                                                    <h1>View Bookings</h1>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        }
                    </table>
                </div>

                {
                    viewBooking && (
                        <>

                            <div class="flex justify-between items-center pt-20 bg-black text-gray-200">
                                <h1 class={`${poppins.className} text-4xl font-bold `}>Existing Bookings</h1>
                            </div>

                            <div class={`${poppins.className} relative overflow-x-auto mt-10`}>
                                <table class="w-full text-sm text-left text-gray-200 ">
                                    <thead class="text-md text-gray-200  bg-black border border-gray-800  ">
                                        <tr>
                                            <th scope="col" class="px-6 py-3">
                                                Sr. No.
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Contact
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Check In
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Check Out
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Budget Per Person
                                            </th>
                                            <th scope="col" class="px-6 py-3">
                                                Total
                                            </th>

                                            <th scope="col" class="px-6 py-3">
                                                Options
                                            </th>
                                        </tr>
                                    </thead>
                                    {
                                        bookingsObj.map((booking) => (

                                            <tbody>
                                                <tr class="bg-black border border-gray-800  ">
                                                    <th scope="row" class="w-24 px-6 py-4 text-center font-medium text-gray-200 whitespace-nowrap ">
                                                        <h1>{bcount++}</h1>
                                                    </th>
                                                    <td class="px-6 py-4 text-gray-200">
                                                        <h1 className='truncate w-36'>{booking.name}</h1>
                                                    </td>
                                                    <td class="px-6 py-4 text-gray-200">
                                                        <h1 className='truncate w-20'>{booking.contact}</h1>
                                                    </td>
                                                    <td class="px-6 py-4 text-gray-200">
                                                        <h1 className='truncate w-20'>{booking.checkIn}</h1>
                                                    </td>
                                                    <td class="px-6 py-4 text-gray-200">
                                                        <h1 className='truncate w-20'>{booking.checkOut}</h1>
                                                    </td>
                                                    <td class="px-6 py-4 text-gray-200">
                                                        <h1 className='truncate w-20'>{booking.budgetPerPerson}</h1>
                                                    </td>
                                                    <td class="px-6 py-4 text-gray-200">
                                                        <h1 className='truncate w-20'>{booking.total}</h1>
                                                    </td>

                                                    <td class="px-6 py-4 text-gray-200">
                                                        <div className='flex justify-around items-center w-[130px] space-x-4'>
                                                            <div onClick={() => deleteBooking(booking)} className=' w-32 flex justify-around items-center cursor-pointer' >
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
                            </div></>
                    )
                }


            </div>
        </div>
    );
}

export default ViewBookings;
