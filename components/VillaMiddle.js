"use client"

import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { Inter, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../contexts/AuthContext"
import DatePicker from 'react-datepicker';
import Select from 'react-select';


import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import VillaNavbar from './VillaNavbar';

const raleway = Raleway({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['400', '700'],
  subsets: ['latin'],
});



function VillaMiddle() {
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

        let v
        if (typeof window !== 'undefined') {
          v = localStorage.getItem("villaName");
          setVilla(v)
        }



        const q = query(
          collection(db, "bookings"),
          where("villa", "==", v),
        );

        const querySnapshot = await getDocs(q);
        // const querySnapshot = await getDocs(collection(db, "bookings"));

        if (querySnapshot.empty) {
          alert("Not found");
        } else {
          const fetchedBookings = [];

          querySnapshot.forEach((doc) => {
            fetchedBookings.push({ id: doc.id, name: doc.data().name, people: doc.data().people, budgetPerPerson: doc.data().budgetPerPerson, contact: doc.data().contact, checkIn: doc.data().checkIn, checkOut: doc.data().checkOut, total: doc.data().total, villa: doc.data().villa });
          });

          console.log(fetchedBookings)
          setBookingsObj(fetchedBookings);
          setFetch(true);
        }
      }

      fetchBookingObj();
    }
  }, [fetch]);



  // useEffect(() => {
  //   async function findBookings() {


  //     const q = query(
  //       collection(db, "bookings"),
  //       where("villa", "==", "saj villa"),
  //     );

  //     const querySnapshot = await getDocs(q);
  //     const fetchedBookings = [];

  //     querySnapshot.forEach((doc) => {
  //       fetchedBookings.push({ id: doc.id, checkIn: doc.data().checkIn, days: doc.data().days, checkOut: doc.data().checkOut, people: doc.data().people, budgetPerPerson: doc.data().budgetPerPerson, contact: doc.data().contact, name: doc.data().name, total: doc.data().total });
  //     });

  //     console.log()

  //     setBookingsObj(fetchedBookings);

  //   }
  //   findBookings();

  // }, [fetch])




  async function deleteBooking(booking) {
    await deleteDoc(doc(db, "auditorium-bookings", booking.id));
    alert("Deleted Booking Successfully")
    window.location.reload();
  }



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
        alert('Created Booking Successfully');
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
      <div className='w-screen h-screen flex flex-col justify-start items-center '>


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

        <div class="flex justify-between items-center pt-20 ">
          <h1 class={`${inter.className} text-4xl font-bold `}>Existing Bookings</h1>
        </div>

        <div class={`${inter.className} relative overflow-x-auto mt-10`}>
          <table class="w-full text-sm text-left  ">
            <thead class="text-md border border-gray-800  ">
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

                {/* <th scope="col" class="px-6 py-3">
                  Options
                </th> */}
              </tr>
            </thead>
            {
              bookingsObj.map((booking) => (

                <tbody>
                  <tr class=" border border-gray-800  ">
                    <th scope="row" class="w-24 px-6 py-4 text-center font-medium  whitespace-nowrap ">
                      <h1>{bcount++}</h1>
                    </th>
                    <td class="px-6 py-4 ">
                      <h1 className='truncate w-36'>{booking.name}</h1>
                    </td>
                    <td class="px-6 py-4 ">
                      <h1 className='truncate w-36'>{booking.contact}</h1>
                    </td>
                    <td class="px-6 py-4 ">
                      <h1 className='truncate w-20'>{booking.checkIn}</h1>
                    </td>
                    <td class="px-6 py-4 ">
                      <h1 className='truncate w-20'>{booking.checkOut}</h1>
                    </td>
                    <td class="px-6 py-4 ">
                      <h1 className='truncate w-20'>{booking.budgetPerPerson}</h1>
                    </td>
                    <td class="px-6 py-4 ">
                      <h1 className='truncate w-20'>{booking.total}</h1>
                    </td>

                    {/* <td class="px-6 py-4 ">
                      <div className='flex justify-around items-center w-[130px] space-x-4'>
                        <div onClick={() => deleteBooking(booking)} className=' w-32 flex justify-around items-center cursor-pointer' >
                          <img src='/delete.png' alt="remove" className='w-5 h-5 ' />
                          <h1>Delete Record</h1>
                        </div>

                      </div>
                    </td> */}
                  </tr>
                </tbody>
              ))
            }
          </table>
        </div>


      </div>
    </>

  )
}

export default VillaMiddle