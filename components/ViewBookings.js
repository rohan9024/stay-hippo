"use client"

import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Inter, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';


import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import CsvExport from '../CsvExport';

const raleway = Raleway({
    weight: ['400', '700'],
    subsets: ['latin'],
});

const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
});



function ViewBookings() {
    const router = useRouter();
    const [name, setName] = useState(null)
    const [people, setPeople] = useState(null)
    const [days, setDays] = useState(null)
    const [budgetPerPerson, setBudgetPerPerson] = useState(null)
    const [contact, setContact] = useState(null)

    const [fetch, setFetch] = useState(false)
    const [villa, setVilla] = useState(null)

    const [bookingsObj, setBookingsObj] = useState([])


    var bcount = 1;

    useEffect(() => {
        if (!fetch) {
            const fetchBookingObj = async () => {

                const querySnapshot = await getDocs(collection(db, "bookings"));

                if (querySnapshot.empty) {
                    alert("Not found");
                } else {
                    const fetchedBookings = [];

                    querySnapshot.forEach((doc) => {
                        fetchedBookings.push({ id: doc.id, name: doc.data().name, people: doc.data().people, minimum: doc.data().minimum, maximum: doc.data().maximum, contact: doc.data().contact, checkIn: doc.data().checkIn, checkOut: doc.data().checkOut, flexibility: doc.data().flexibility, notes: doc.data().notes, location: doc.data().location, group: doc.data().group, days: doc.data().days });
                    });

                    setBookingsObj(fetchedBookings);
                    setFetch(true);
                }
            }

            fetchBookingObj();
        }


    }, [fetch]);






    const createBooking = async () => {

        if (name && contact && people && budgetPerPerson && days) {
            const total = budgetPerPerson * days;

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            today = dd + '/' + mm + '/' + yyyy;

            let v
            if (typeof window !== 'undefined') {
                v = localStorage.getItem("villaName");
            }
            try {
                await addDoc(collection(db, 'bookings'), {
                    name: name,
                    contact: contact,
                    villa: v,
                    budgetPerPerson: budgetPerPerson,
                    total: total,
                    checkIn: today,
                    days: days,
                    people: people
                });
                alert('Created Enquiry Successfully');
                window.location.reload();
            } catch (error) {
                alert('Something went wrong');
            }
        }
        else {
            alert('Something is missing')
        }


    };

    async function checkout(booking) {

        const docRef = doc(db, "bookings", booking.id);

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;
        try {
            await updateDoc(docRef, {
                checkout: today
            });

            alert('Updated the Booking successfully');
            window.location.reload();
        } catch (error) {
            alert(error)
            alert('Unable to update');
        }
    }


    async function deleteBooking(booking) {
        await deleteDoc(doc(db, "bookings", booking.id));
        alert("Deleted Booking Successfully")
        window.location.reload();
    }

    const totalBookings = bookingsObj.length;
    let totalSum = 0;

    const parseDate = (dateString) => {

        if (dateString) {
            const [day, month, year] = dateString.split(/[/\-]/).map(Number);
            return new Date(year, month - 1, day);
        }
        else {
            return;
        }


    };
    // const sortBookingsByCheckInDate = (bookings) => {
    //     return bookings.sort((a, b) => parseDate(a.checkIn) - parseDate(b.checkIn));
    // };

    // const [sortedBookings, setSortedBookings] = useState([]);

    // React.useEffect(() => {
    //     const sorted = sortBookingsByCheckInDate(bookingsObj);
    //     setSortedBookings(sorted);
    // }, [bookingsObj]);


    async function deletePreviousEnquiries() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // console.log(today)

        // const bookingdate = parseDate('20/05/2024')


        // if(today >= bookingdate){
        //     console.log("previous")
        // }
        // else{
        //     console.log("advance")

        // }
        const filteredData = bookingsObj.filter(booking => parseDate(booking.checkIn) <= today);

        filteredData.map(async (data) => {
            await deleteDoc(doc(db, "bookings", data.id));
        })

        alert("Deleted Previous Enquiries Successfully")
        window.location.reload();

    }
    async function deleteAllEnquiries() {


        bookingsObj.map(async (data) => {
            await deleteDoc(doc(db, "bookings", data.id));
        })

        alert("Deleted All Enquiries Successfully")
        // window.location.reload();

    }

    const bookingsWithoutId = bookingsObj.map(({ id, ...rest }) => rest);


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='w-screen h-auto flex flex-col justify-start items-center '>


                {/* <div class="w-screen px-40 py-10 flex flex-col ">
          <div class="flex justify-between items-center ">
            <h1 class={`${inter.className} text-4xl font-bold `}>Existing Bookings</h1>
          </div>
        </div> */}


                {/* List of boxes */}
                {/* <div class="grid grid-cols-4 gap-10 py-10 ">
          {bookingsObj.length > 0 ?

            (
              bookingsObj
                .map((booking) => (
                  <div class="flex flex-col justify-center border border-gray-900 shadow-md min-w-[280px] h-[340px] px-5 space-y-2 rounded-lg ">
                    <h1 class={`${inter.className} text-xl font-bold cursor-pointer`}>Name: {booking.name}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Contact: {booking.contact}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>No. Of People: {booking.people}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Budget Per Person: {booking.budgetPerPerson}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>No. of Days: {booking.days}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Total: {booking.total}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Check In: {booking.checkIn}</h1>
                    <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Check Out: {booking.checkOut}</h1>

                    <div className='flex justify-end items-end space-x-2 '>
                      {booking.checkOut ? null : (
                        <div class="mt-2 cursor-pointer " onClick={() => checkout(booking)} >
                          <img src="/accept.png" alt="checkout" className='w-7 h-7' />
                        </div>
                      )}
                      <div class="mt-2 cursor-pointer " onClick={() => deleteBooking(booking)} >
                        <img src="/delete.png" alt="delete" className='w-7 h-7' />
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className='text-left w-screen px-44 '>
                <h1 class={`${inter.className} text-xl font-medium  cursor-pointer `}>No Bookings Found</h1>
              </div>
            )}

        </div> */}

                <div class="flex justify-between items-center pt-20 space-x-10">
                    <h1 class={`${inter.className} text-4xl font-bold italic `}>All Enquiries</h1>
                    <div class=" flex justify-center items-center " >
                        <h1 class={`${inter.className} text-2xl font-bold text-red-600 `}>LIVE</h1>
                        <div className='flex justify-center items-center w-10 h-10 rounded-full  '>
                            <img src="/live.gif" alt="live" className=' w-10 h-32 object-cover' />
                        </div>


                    </div>

                    <div onClick={deletePreviousEnquiries} className='bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2  transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg  cursor-pointer'>
                        <h1 class={`${inter.className} text-md  `}>Delete Previous Entries</h1>
                    </div>
                    <div onClick={deleteAllEnquiries} className='bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2  transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg  cursor-pointer'>
                        <h1 class={`${inter.className} text-md  `}>Delete All Entries</h1>
                    </div>

                </div>



                <div class={`${inter.className} relative overflow-x-auto mt-10`}>
                    <table class="min-w-full text-sm text-left">
                        <thead class="text-md border border-gray-800">
                            <tr>
                                <th scope="col" class="px-4 py-4">Sr. No.</th>
                                <th scope="col" class="px-4 py-4">Name</th>
                                <th scope="col" class="px-4 py-4">Contact</th>
                                <th scope="col" class="px-4 py-4">Location</th>
                                <th scope="col" class="px-4 py-4">Flexibility</th>
                                <th scope="col" class="px-4 py-4">Notes</th>
                                <th scope="col" class="px-4 py-4">Check In</th>
                                <th scope="col" class="px-4 py-4">Check Out</th>
                                <th scope="col" class="px-4 py-4">People</th>
                                <th scope="col" class="px-4 py-4">Budget</th>
                                <th scope="col" class="px-4 py-4">Days</th>
                                <th scope="col" class="px-4 py-4">Options</th>
                            </tr>
                        </thead>
                        {bookingsObj.map((booking) => {
                            totalSum += booking.maximum;
                            return (
                                <tbody>
                                    <tr class="border border-gray-800">
                                        <th scope="row" class="px-4 py-4 text-center font-medium whitespace-nowrap">
                                            <h1>{bcount++}</h1>
                                        </th>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-24'>{booking.name}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-24'>{booking.contact}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-24'>{booking.location}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-24'>{booking.flexibility}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-24'>{booking.notes}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-20'>{booking.checkIn}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-20'>{booking.checkOut}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-16'>{booking.people}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-16'>{booking.maximum}</h1>
                                        </td>
                                        <td class="px-4 py-4">
                                            <h1 className='truncate w-16'>{booking.days}</h1>
                                        </td>

                                        <td class="px-6 py-4">
                                            <div className='flex justify-around items-center w-[120px] space-x-4'>
                                                <div onClick={() => deleteBooking(booking)} className=' w-32 flex justify-around items-center cursor-pointer' >
                                                    <img src='/delete.png' alt="remove" className='w-5 h-5 ' />
                                                    <h1>Delete Record</h1>
                                                </div>
                                                {/* <div onClick={() => setEditModal(stock)} className=' w-28 flex justify-around items-center cursor-pointer' >
                                                    <img src="/edit.png" alt="edit" className='w-5 h-5' />
                                                    <h1>Edit Record</h1>
                                                </div> */}
                                            </div>
                                        </td>

                                    </tr>
                                </tbody>
                            );
                        })}

                    </table>
                </div>


                <div class="flex justify-end my-10">
                    <CsvExport data={bookingsWithoutId} fileName="exported_data.csv" class="" />
                </div>

            </div>
        </>

    )
}

export default ViewBookings