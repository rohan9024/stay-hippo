"use client"

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Inter, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
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
    const [name, setName] = useState(null);
    const [people, setPeople] = useState(null);
    const [days, setDays] = useState(null);
    const [budgetPerPerson, setBudgetPerPerson] = useState(null);
    const [contact, setContact] = useState(null);
    const [fetch, setFetch] = useState(false);
    const [villa, setVilla] = useState(null);
    const [bookingsObj, setBookingsObj] = useState([]);
    const [selectedBookings, setSelectedBookings] = useState(new Set());

    useEffect(() => {
        if (!fetch) {
            const fetchBookingObj = async () => {
                const querySnapshot = await getDocs(collection(db, "bookings"));
                if (querySnapshot.empty) {
                    alert("Not found");
                } else {
                    const fetchedBookings = [];
                    querySnapshot.forEach((doc) => {
                        fetchedBookings.push({ id: doc.id, ...doc.data() });
                    });
                    setBookingsObj(fetchedBookings);
                    setFetch(true);
                }
            };
            fetchBookingObj();
        }
    }, [fetch]);



    const createBooking = async () => {
        if (name && contact && people && budgetPerPerson && days) {
            const total = budgetPerPerson * days;
            let today = new Date();
            today = today.toLocaleDateString('en-GB').split('/').join('/');

            let v = localStorage.getItem("villaName");
            try {
                await addDoc(collection(db, 'bookings'), {
                    name, contact, villa: v, budgetPerPerson, total, checkIn: today, days, people
                });
                alert('Created Enquiry Successfully');
                window.location.reload();
            } catch (error) {
                alert('Something went wrong');
            }
        } else {
            alert('Something is missing');
        }
    };

    const checkout = async (booking) => {
        const docRef = doc(db, "bookings", booking.id);
        let today = new Date();
        today = today.toLocaleDateString('en-GB').split('/').join('/');

        try {
            await updateDoc(docRef, { checkout: today });
            alert('Updated the Booking successfully');
            window.location.reload();
        } catch (error) {
            alert('Unable to update');
        }
    };

    const deleteBooking = async (booking) => {
        await deleteDoc(doc(db, "bookings", booking.id));
        alert("Deleted Booking Successfully");
        window.location.reload();
    };


    // New ones
    // const parseDateTime = (dateTimeString) => {
    //     if (!dateTimeString || typeof dateTimeString !== 'string') return null; // Handle undefined, null, or non-string dates
    
    //     const [datePart, timePart] = dateTimeString.split(' ');
    //     if (!datePart || !timePart) return null;
    
    //     const [day, month, year] = datePart.split('/').map(Number);
    //     const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
    //     if (!day || !month || !year || !hours || !minutes || !seconds) return null;
    
    //     return new Date(year, month - 1, day, hours, minutes, seconds);
    // };
    

    // // New ones
    // const sortedBookings = bookingsObj.sort((a, b) => {
    //     const dateA = parseDateTime(a.createdAt);
    //     const dateB = parseDateTime(b.createdAt);

    //     if (!dateA) return 1; // Place undefined dates after defined ones
    //     if (!dateB) return -1;

    //     return dateA - dateB;
    // });


    const parseDateTime = (dateTimeString) => {
        if (!dateTimeString || typeof dateTimeString !== 'string') return null; // Handle undefined, null, or non-string dates
    
        const [datePart, timePart] = dateTimeString.split(' ');
        if (!datePart || !timePart) return null;
    
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
        if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
    
        return new Date(year, month - 1, day, hours, minutes, seconds);
    };
    const sortedBookings = bookingsObj.sort((a, b) => {
        const dateA = parseDateTime(a.createdAt);
        const dateB = parseDateTime(b.createdAt);
    
        if (!dateA) return 1; // Place undefined dates after defined ones
        if (!dateB) return -1;
    
        return dateA - dateB;
    });




    // sortedBookings.map((booking, index) => {
    //     console.log(booking.createdAt)
    // })

    const deletePreviousEnquiries = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredData = bookingsObj.filter(booking => parseDate(booking.checkIn) <= today);
        filteredData.map(async (data) => {
            await deleteDoc(doc(db, "bookings", data.id));
        });
        alert("Deleted Previous Enquiries Successfully");
        window.location.reload();
    };

    const deleteAllEnquiries = async () => {
        bookingsObj.map(async (data) => {
            await deleteDoc(doc(db, "bookings", data.id));
        });
        alert("Deleted All Enquiries Successfully");
    };
    const deleteSelected = async () => {
        const selectedArray = Array.from(selectedBookings);

        selectedArray.forEach(async (id) => {
            try {
                await deleteDoc(doc(db, "bookings", id));
            } catch (error) {
                console.error(`Error deleting document with ID ${id}: `, error);
            }
        });

        alert("Deleted Selected Enquiries Successfully");

    };

    const handleCheckboxChange = (id) => {
        setSelectedBookings((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

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
                <div className="flex justify-between items-center pt-20 space-x-10">
                    <h1 className={`${inter.className} text-4xl font-bold italic`}>All Enquiries</h1>
                    <div className="flex justify-center items-center">
                        <h1 className={`${inter.className} text-2xl font-bold text-red-600`}>LIVE</h1>
                        <div className='flex justify-center items-center w-10 h-10 rounded-full'>
                            <img src="/live.gif" alt="live" className='w-10 h-32 object-cover' />
                        </div>
                    </div>
                    <div onClick={deletePreviousEnquiries} className='bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2 transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg cursor-pointer'>
                        <h1 className={`${inter.className} text-md`}>Delete Previous Entries</h1>
                    </div>
                    <div onClick={deleteAllEnquiries} className='bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2 transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg cursor-pointer'>
                        <h1 className={`${inter.className} text-md`}>Delete All Entries</h1>
                    </div>
                    <div onClick={deleteSelected} className='bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2 transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg cursor-pointer'>
                        <h1 className={`${inter.className} text-md`}>Delete Selected</h1>
                    </div>
                </div>
                <div className={`${inter.className} relative overflow-x-auto mt-10`}>
                    <table className="min-w-full text-sm text-left">
                        <thead className="text-sm border border-gray-300">
                            <tr>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">
                                    <input type="checkbox" className="form-checkbox" onChange={(e) => setSelectedBookings(e.target.checked ? new Set(bookingsObj.map(b => b.id)) : new Set())} />
                                </th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Name</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Contact</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Location</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Flexibility</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Notes</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Check In</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Check Out</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">People</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Budget</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Days</th>
                                <th scope="col" className="px-4 py-4 border border-gray-300 bg-gray-100">Options</th>
                            </tr>
                        </thead>
                        {sortedBookings.map((booking, index) => (
                            <tbody key={booking.id}>
                                <tr className="border border-gray-300">
                                    <th scope="row" className="px-4 py-4 text-center font-medium whitespace-nowrap border border-gray-200 bg-gray-50">
                                        <input type="checkbox" className="form-checkbox" checked={selectedBookings.has(booking.id)} onChange={() => handleCheckboxChange(booking.id)} />
                                    </th>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-24'>{booking.name}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-24'>{booking.contact}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-24'>{booking.location}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-24'>{booking.flexibility}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-24'>{booking.notes}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-20'>{booking.checkIn}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-20'>{booking.checkOut}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-16'>{booking.people}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-16'>{booking.maximum}</h1>
                                    </td>
                                    <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-16'>{booking.days}</h1>
                                    </td>
                                    {/* <td className="px-4 py-4 border border-gray-300 bg-gray-50">
                                        <h1 className='truncate w-44'>{booking.createdAt}</h1>
                                    </td> */}
                                    <td className="px-6 py-4 border border-gray-300 bg-gray-50">
                                        <div className='flex justify-around items-center w-[120px] space-x-4'>
                                            <div onClick={() => deleteBooking(booking)} className='w-32 flex justify-around items-center cursor-pointer'>
                                                <img src='/delete.png' alt="remove" className='w-5 h-5' />
                                                <h1>Delete Record</h1>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
                <div className="flex justify-end my-10">
                    <CsvExport data={bookingsWithoutId} fileName="exported_data.csv" />
                </div>
            </div>
        </>
    );
}

export default ViewBookings;
