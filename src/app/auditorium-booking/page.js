"use client"

import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../../components/Navbar';
import { Inter, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../../../contexts/AuthContext"
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import { Poppins } from 'next/font/google';
import Select from 'react-select';


import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';

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

function page() {
    const router = useRouter();
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [hours, setHours] = useState('01');
    const [period, setPeriod] = useState('AM');
    const [eventName, setEventName] = useState('');

    const [fetch, setFetch] = useState(false)

    const [bookingObj, setBookingObj] = useState([])

    useEffect(() => {
        if (!fetch) {
            const fetchBookingObj = async () => {
                const querySnapshot = await getDocs(collection(db, "auditorium-bookings"));
                const fetchedBookings = [];

                querySnapshot.forEach((doc) => {
                    fetchedBookings.push({ id: doc.id, date: doc.data().date, eventName: doc.data().eventName, time: doc.data().time, });
                });

                setBookingObj(fetchedBookings);
                setFetch(true);
            }

            fetchBookingObj();
        }
    }, [fetch]);


    const handleHoursChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0 && value <= 12) {
            setHours(value);
        }
    };

    const handleMinutesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value < 60) {
            setMinutes(value);
        }
    };



    const { admin, setAdmin } = useContext(AuthContext);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('12:00');

    const handlePeriodDropdown = (event) => {
        setPeriod(event.target.value);
    };


    async function addEvent(formattedDate, time, eventName) {
        if (formattedDate && eventName && time) {
            try {
                await addDoc(collection(db, 'auditorium-bookings'), {
                    date: formattedDate,
                    time: time,
                    eventName: eventName,
                });
                alert("Created Event Successfully")

            } catch (error) {
                alert('Something went wrong');
            }

            window.location.reload();
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        const time = `${hours.label} ${period.label}`
        console.log('Selected Date:', formattedDate);
        console.log('Selected Time:', time);
        console.log('Event Name:', eventName);
        addEvent(formattedDate, time, eventName);


    };
    const minDate = new Date("11/22/2019 8:00 AM");
    const maxDate = new Date("11/25/2019 6:00 PM");

    const periodList = [
        "AM",
        "PM"
    ]

    const hourOptions = [
        { value: '01', label: '01' },
        { value: '02', label: '02' },
        { value: '03', label: '03' },
        { value: '04', label: '04' },
        { value: '05', label: '05' },
        { value: '06', label: '06' },
        { value: '07', label: '07' },
        { value: '08', label: '08' },
        { value: '09', label: '09' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: '12' },
    ];

    const periodOptions = [
        { value: 'AM', label: 'AM' },
        { value: 'PM', label: 'PM' },
    ];

    async function deleteBooking(booking) {
        await deleteDoc(doc(db, "auditorium-bookings", booking.id));
        alert("Deleted Booking Successfully")
        window.location.reload();
    }
    return (
        <>
            <Navbar />
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
                <div className='flex flex-col justify-center items-center p-20  my-28 rounded-lg space-y-5 border border-gray-200 shadow-lg '>
                    <h1 className={`${raleway.className} text-4xl font-bold mb-10`}>Auditorium Booking </h1>
                    <form onSubmit={handleSubmit} className='flex flex-col justify-start items-start space-y-10 '>

                        <div className="mb-4 flex justify-center items-center ">
                            <h1 className={`${inter.className} text-md font-bold mr-5`}>Select Date</h1>

                            <DatePicker dateFormat="dd/MM/yyyy" selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                        </div>

                        <div className='flex justify-start items-start space-x-10'>
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
                        </div>

                        <div className="mb-4 flex flex-col justify-start items-start space-y-4">
                            <h1 className={`${inter.className} text-md font-bold `}>Enter Event Name</h1>
                            <input
                                onChange={(e) => setEventName(e.target.value)}
                                value={eventName}
                                type="text"
                                placeholder="Tech Team Event"
                                className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-400 w-96 rounded-lg"
                            />
                        </div>


                        <div onClick={handleSubmit} type="submit" class="cursor-pointer relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-50 w-72 mx-auto">
                            <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                            <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span class="relative text-center text-md">Book Now</span>
                        </div>

                    </form>
                </div>

                <div class="w-screen px-44 py-10 flex flex-col ">
                    <div class="flex justify-between items-center ">
                        <h1 class={`${poppins.className} text-4xl font-bold `}>Existing Bookings</h1>

                    </div>
                </div>


                {/* List of boxes */}
                <div class="grid grid-cols-4 gap-10 py-14 ">
                    {bookingObj.map((booking) => (
                        <div class="flex flex-col justify-center border border-gray-300 shadow-md min-w-[250px] h-[180px] px-5 rounded-lg ">
                            <h1 class={`${poppins.className} text-xl font-bold cursor-pointer`}>{booking.date}</h1>
                            <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>{booking.time}</h1>
                            <h1 class={`${poppins.className} text-md font-medium  cursor-pointer `}>{booking.eventName}</h1>

                            <div className='flex justify-end items-end space-x-2 '>

                                {/* <div class="mt-10 cursor-pointer " onClick={() => setEditItem(item)} >
                                    <img src="/edit.png" alt="edit" className='w-7 h-7' />
                                </div> */}
                                <div class="mt-10 cursor-pointer " onClick={() => deleteBooking(booking)} >
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

export default page