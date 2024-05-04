"use client"

import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { Inter, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../contexts/AuthContext"
import DatePicker from 'react-datepicker';
import { Poppins } from 'next/font/google';
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

const poppins = Poppins({
  weight: ['100', '400', '500', '600', '700', '800'],
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

  const [bookingObj, setBookingObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchBookingObj = async () => {

        let v
        if (typeof window !== 'undefined') {
          v = localStorage.getItem("villaName");
        }
        const q = query(
          collection(db, "bookings"),
          where("villa", "==", v),
        );

        const querySnapshot = await getDocs(q);
        const fetchedBookings = [];

        querySnapshot.forEach((doc) => {
          fetchedBookings.push({ id: doc.id, checkIn: doc.data().checkIn, days: doc.data().days, checkOut: doc.data().checkOut, people: doc.data().people, budgetPerPerson: doc.data().budgetPerPerson, contact: doc.data().contact, name: doc.data().name, total: doc.data().total });
        });

        setBookingObj(fetchedBookings);
        setFetch(true);
      }

      fetchBookingObj();
    }
  }, [fetch]);




  async function deleteBooking(booking) {
    await deleteDoc(doc(db, "auditorium-bookings", booking.id));
    alert("Deleted Booking Successfully")
    window.location.reload();
  }



  const createBooking = async () => {

    if (name && contact  && people && budgetPerPerson && days ) {
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
      <div className='w-screen flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center p-20  my-20 rounded-lg space-y-5 border border-gray-200 shadow-lg '>
          <h1 className={`${raleway.className} text-4xl font-bold mb-10`}>Create Booking </h1>
          <form className='flex flex-col justify-start items-start space-y-10 '>

            {/* <div className="mb-4 flex justify-center items-center ">
                            <h1 className={`${inter.className} text-md font-bold mr-5`}>Select Date</h1>

                            <DatePicker dateFormat="dd/MM/yyyy" selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </div> */}

            {/* <div className='flex justify-start items-start space-x-10'>
                            <div className="flex flex-col justify-start items-start space-y-4">
                                <h1 className="font-bold text-md">Hours</h1>
                                <Select
                                    defaultValue={hours}
                                    onChange={setHours}
                                    options={hourOptions}
                                />
                            </div>
                            <div className="flex flex-col justify-start items-center space-y-4">
                                <h1 className="text-md font-bold">Period</h1>
                                <Select
                                    defaultValue={period}
                                    onChange={setPeriod}
                                    options={periodOptions}
                                />
                            </div>
                        </div> */}

            <div className=" flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Enter Name</h1>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Rakesh Patil"
                className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-400 w-96 rounded-lg"
              />
            </div>
            <div className=" flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Enter Contact</h1>
              <input
                onChange={(e) => setContact(e.target.value)}
                value={contact}
                type="text"
                placeholder="9134244728"
                className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-400 w-96 rounded-lg"
              />
            </div>
            <div className=" flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Enter Budget Per Person</h1>
              <input
                onChange={(e) => setBudgetPerPerson(e.target.value)}
                value={budgetPerPerson}
                type="number"
                placeholder="0"
                className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-400 w-96 rounded-lg"
              />
            </div>
            <div className=" flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Enter No. Of People</h1>
              <input
                onChange={(e) => setPeople(e.target.value)}
                value={people}
                type="number"
                placeholder="0"
                className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-400 w-96 rounded-lg"
              />
            </div>
            <div className=" flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Enter No. of Days</h1>
              <input
                onChange={(e) => setDays(e.target.value)}
                value={days}
                type="number"
                placeholder="0"
                className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-400 w-96 rounded-lg"
              />
            </div>
            {/* <div className="flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Select Villa</h1>

              <select
                value={villaName}
                onChange={handleVillaDropdown}
                className="block w-96 py-2 px-5 leading-tight border border-gray-700 focus:outline-none cursor-pointer"
              >
                {allVillasObj.map((villa, index) => (
                  <option key={index} value={villa.name}>
                    {villa.name}
                  </option>
                ))}
              </select>
            </div> */}



            <div onClick={createBooking} type="submit" class="cursor-pointer relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-50 w-72 mx-auto">
              <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span class="relative text-center text-md">Book Now</span>
            </div>

          </form>
        </div>

        <div class="w-screen px-40 py-10 flex flex-col ">
          <div class="flex justify-between items-center ">
            <h1 class={`${poppins.className} text-4xl font-bold `}>Checked In Bookings</h1>
          </div>
        </div>


        {/* List of boxes */}
        <div class="grid grid-cols-4 gap-10 py-10 ">
          {bookingObj.map((booking) => (
            <div class="flex flex-col justify-center border border-gray-300 shadow-md min-w-[280px] h-[340px] px-5 space-y-2 rounded-lg ">
              <h1 class={`${poppins.className} text-xl font-bold cursor-pointer`}>Name: {booking.name}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>Contact: {booking.contact}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>No. Of People: {booking.people}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>Budget Per Person: {booking.budgetPerPerson}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>No. of Days: {booking.days}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>Total: {booking.total}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>Check In: {booking.checkIn}</h1>
              <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>Check Out: {booking.checkOut}</h1>

              <div className='flex justify-end items-end space-x-2 '>
                {booking.checkOut ? null : (

                  <div class="mt-2 cursor-pointer " onClick={() => checkout(booking)} >
                    <img src="/accept.png" alt="checkout" className='w-7 h-7' />
                  </div>


                )

                }
                <div class="mt-2 cursor-pointer " onClick={() => deleteBooking(booking)} >
                  <img src="/delete.png" alt="delete" className='w-7 h-7' />
                </div>
              </div>

            </div>
          ))}
        </div>


      </div>
    </>

  )
}

export default VillaMiddle