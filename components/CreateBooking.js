"use client"
import Papa from 'papaparse';

import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Gruppo, Inter, Raleway, VT323 } from 'next/font/google';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

import 'react-time-picker/dist/TimePicker.css';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import enGB from 'date-fns/locale/en-GB';
import { format } from 'date-fns';

registerLocale('en-GB', enGB);


const raleway = Raleway({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['400', '700'],
  subsets: ['latin'],
});



function CreateBooking() {
  const router = useRouter();
  const [name, setName] = useState(null)
  const [people, setPeople] = useState(null)
  const [days, setDays] = useState(null)
  const [contact, setContact] = useState(null)
  const [minimum, setMinimum] = useState()
  const [location, setLocation] = useState()
  const [maximum, setMaximum] = useState()
  const [notes, setNotes] = useState()
  const [flexibility, setFlexibility] = useState()
  const [villaName, setVillaName] = useState('N/A')
  const [searchGroup, setSearchGroup] = useState('N/A')
  const [group, setGroup] = useState("N/A")

  const [fetch, setFetch] = useState(false)

  const [bookingObj, setBookingObj] = useState([])
  const [CSVData, setCSVData] = useState([])
  var bcount = 1;

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  // useEffect(() => {
  //   if (!fetch) {
  //     const fetchBookingObj = async () => {

  //       let v
  //       if (typeof window !== 'undefined') {
  //         v = localStorage.getItem("villaName");
  //       }
  //       const q = query(
  //         collection(db, "bookings"),
  //         where("villa", "==", v),
  //       );

  //       const querySnapshot = await getDocs(q);
  //       const fetchedBookings = [];

  //       querySnapshot.forEach((doc) => {
  //         fetchedBookings.push({ id: doc.id, checkIn: doc.data().checkIn, days: doc.data().days, checkOut: doc.data().checkOut, people: doc.data().people, budgetPerPerson: doc.data().budgetPerPerson, contact: doc.data().contact, name: doc.data().name, total: doc.data().total });
  //       });

  //       setBookingObj(fetchedBookings);
  //       setFetch(true);
  //     }

  //     fetchBookingObj();
  //   }
  // }, [fetch]);




  async function deleteBooking(booking) {
    await deleteDoc(doc(db, "auditorium-bookings", booking.id));
    alert("Deleted Booking Successfully")
    window.location.reload();
  }


  const formatDate = (date) => {
    return date ? format(date, 'dd/MM/yyyy') : ''; // Use date-fns format function
  };


  const createBooking = async () => {

    if (name && contact && people && days && minimum && maximum && group && checkOutDate && checkInDate && notes && location && flexibility) {
      // const total = maximum * days;

      let today = new Date();

      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      let yyyy = today.getFullYear();

      let hh = String(today.getHours()).padStart(2, '0');
      let min = String(today.getMinutes()).padStart(2, '0');
      let ss = String(today.getSeconds()).padStart(2, '0');

      today = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

      console.log({
        name: name,
        contact: contact,
        group: group,
        maximum: parseInt(maximum),
        minimum: parseInt(minimum),
        days: parseInt(days),
        people: parseInt(people),
        checkIn: formatDate(checkInDate),
        checkOut: formatDate(checkOutDate),
      })
      // try {
      //   await addDoc(collection(db, 'bookings'), {
      //     name: name,
      //     contact: contact,
      //     group: group,
      //     checkIn: checkIn,
      //     checkOut: checkOut,
      //     flexibility: flexibility,
      //     location: location,
      //     notes: notes,
      //     maximum: parseInt(maximum),
      //     minimum: parseInt(minimum),
      //     days: parseInt(days),
      //     people: parseInt(people),
      //     createdAt: today
      //   });
      //   alert('Created Enquiry Successfully');
      //   window.location.reload();
      // } catch (error) {
      //   alert('Something went wrong');
      // }
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
        checkOut: today
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


  const handleVillaDropdown = (event) => {
    setVillaName(event.target.value);
  };
  const handleVilla2Dropdown = (event) => {
    setv2(event.target.value);
  };


  const [allVillasObj, setAllVillasObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchVillaObj = async () => {
        const querySnapshot = await getDocs(collection(db, "villas"));
        const fetchedVillas = [{
          id: 1, name: 'N/A', group: 'N/A'
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


  async function findBookings() {


    const q = query(
      collection(db, "bookings"),
      where("group", "==", searchGroup),
    );

    const querySnapshot = await getDocs(q);
    const fetchedBookings = [];

    querySnapshot.forEach((doc) => {
      fetchedBookings.push({ id: doc.id, checkIn: doc.data().checkIn, days: doc.data().days, checkOut: doc.data().checkOut, people: doc.data().people, group: doc.data().group, maximum: doc.data().maximum, minimum: doc.data().minimum, contact: doc.data().contact, name: doc.data().name, flexibility: doc.data().flexibility, location: doc.data().location, notes: doc.data().notes });
    });

    console.log(fetchedBookings)

    setBookingObj(fetchedBookings);

  }

  const [groupObj, setGroupObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchGroupObj = async () => {
        const querySnapshot = await getDocs(collection(db, "groups"));
        const fetchedGroups = [{
          id: 1, name: "N/A"
        }];


        querySnapshot.forEach((doc) => {
          fetchedGroups.push({ id: doc.id, name: doc.data().name });
        });

        setGroupObj(fetchedGroups);
        setFetch(true);
      }

      fetchGroupObj();
    }
  }, [fetch]);
  const handleGroupDropdown = (event) => {
    setGroup(event.target.value);
  };
  const handleSearchGroupDropdown = (event) => {
    setSearchGroup(event.target.value);
  };



  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const { data } = await parseCsv(file);
      console.log('CSV Data:', data);
      setCSVData(data);
    }
  };

  const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (result) => {
          resolve(result);
        },
        error: (error) => {
          reject(error.message);
        },
        header: true, // Set to false if your CSV doesn't have headers
      });
    });
  };


  const submitToFirebase = async () => {
    try {
      for (const dataItem of CSVData) {
        await addDoc(collection(db, 'bookings'), dataItem);
      }
      alert('Data uploaded successfully!');
    } catch (error) {
      alert(error);
    }
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
      <div className='w-screen flex flex-col justify-center items-center text-black'>
        <div className='flex flex-col justify-center items-center p-20  my-20 rounded-lg space-y-5 border border-gray-300  shadow-lg '>
          <h1 className={`${raleway.className} text-4xl font-bold mb-10`}>Create Enquiry </h1>
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


            <div className='flex justify-center items-center space-x-5'>

              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Name</h1>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Rakesh Patil"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent w-96 rounded-lg"
                />
              </div>
              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Contact</h1>
                <input
                  onChange={(e) => setContact(e.target.value)}
                  value={contact}
                  type="text"
                  placeholder="9134244728"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
            </div>

            {/* <div className=" flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Enter Budget Per Person (Range: 10k-20k)</h1>
              <input
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 10000 && value <= 20000) {
                    setBudgetPerPerson(value);
                  }
                }}
                value={budgetPerPerson}
                type="number"
                placeholder="0"
                className="placeholder:text-gray-500 px-5 py-2 outline-none border border-gray-300 bg-transparent w-96 rounded-lg"
              />

            </div> */}

            <div className='flex justify-center items-center space-x-5'>

              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter No. Of People</h1>
                <input
                  onChange={(e) => setPeople(e.target.value)}
                  value={people}
                  type="number"
                  placeholder="0"
                  className="placeholder:text-gray-500 px-5 py-2 outline-none border border-gray-300 bg-transparent appearance-none w-96 rounded-lg"
                />
              </div>
              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter No. of Days</h1>
                <input
                  onChange={(e) => setDays(e.target.value)}
                  value={days}
                  type="number"
                  placeholder="0"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
            </div>
            <div className='flex justify-center items-center space-x-5'>

              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Minimum Budget</h1>
                <input
                  onChange={(e) => setMinimum(e.target.value)}
                  value={minimum}
                  type="number"
                  placeholder="0"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Maximum Budget</h1>
                <input
                  onChange={(e) => setMaximum(e.target.value)}
                  value={maximum}
                  type="number"
                  placeholder="0"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
            </div>

            <div className='flex justify-center items-center space-x-5'>

              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Location</h1>
                <input
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  type="text"
                  // placeholder="0"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Flexibility</h1>
                <input
                  onChange={(e) => setFlexibility(e.target.value)}
                  value={flexibility}
                  type="text"
                  // placeholder="0"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
            </div>
            <div className='flex justify-center items-center space-x-5'>

              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Enter Notes</h1>
                <input
                  onChange={(e) => setNotes(e.target.value)}
                  value={notes}
                  type="text"
                  // placeholder="0"
                  className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 bg-transparent  w-96 rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Select Group</h1>

                <select
                  value={group}
                  onChange={handleGroupDropdown}
                  className="block w-96 py-2 px-5 leading-tight border border-gray-300  focus:outline-none cursor-pointer"
                >
                  {groupObj.map((group, index) => (
                    <option key={index} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>

              </div>

            </div>
            <div className='flex justify-center items-center space-x-5'>

              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Check In</h1>

                <div className='w-40 flex justify-around items-center cursor-pointer border border-gray-300  rounded-lg focus:outline-none px-5' >
                  <img src="/edit.png" alt="edit" className='w-5 h-5' />

                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    placeholderText="Check In"
                    dateFormat="dd/MM/yyyy"
                    locale="en-GB"
                    className=" text-gray-900 text-sm rounded-lg  block w-full pl-3 p-2.5  focus:outline-none"
                  />
                </div>
              </div>
              <div className=" flex flex-col justify-start items-start space-y-4">
                <h1 className={`${inter.className} text-md font-bold `}>Check Out</h1>


                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  placeholderText="Check Out"
                  dateFormat="dd/MM/yyyy"
                  locale="en-GB"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />


              </div>

            </div>

            {/* <div className="flex flex-col justify-start items-start space-y-4">
              <h1 className={`${inter.className} text-md font-bold `}>Select Villa</h1>

              <select
                value={villaName}
                onChange={handleVillaDropdown}
                className="block w-96 py-2 px-5 leading-tight border border-gray-300   focus:outline-none cursor-pointer"
              >
                {allVillasObj.map((villa, index) => (
                  <option key={index} value={villa.name}>
                    {villa.name}
                  </option>
                ))}
              </select>

            </div> */}


            <div type="submit" onClick={createBooking} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border border-gray-800 rounded-full hover:text-white group hover:bg-gray-600">
              <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span class="relative">Submit</span>
            </div>

          </form>
        </div>


        <div className='flex flex-col justify-start space-y-10 '>
          <h1 className={`${raleway.className} text-3xl font-bold mt-10`}>Upload CSV</h1>
          <input type="file" accept=".csv" onChange={handleFileUpload} />


          {/* <div class="flex items-center justify-center w-full">
                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" class="hidden" />
                            </label>
                        </div> */}


          <div class={`${inter.className} relative overflow-x-auto mt-10`}>
            <table class="min-w-full text-sm text-left">
              <thead class="text-sm border border-gray-800">
                <tr>
                  <th scope="col" class="px-2 py-2">Sr. No.</th>
                  <th scope="col" class="px-2 py-2">Name</th>
                  <th scope="col" class="px-2 py-2">Contact</th>
                  <th scope="col" class="px-2 py-2">Location</th>
                  <th scope="col" class="px-2 py-2">Flexibility</th>
                  <th scope="col" class="px-2 py-2">Notes</th>
                  <th scope="col" class="px-2 py-2">Check In</th>
                  <th scope="col" class="px-2 py-2">Check Out</th>
                  <th scope="col" class="px-2 py-2">People</th>
                  <th scope="col" class="px-2 py-2">Minimum</th>
                  <th scope="col" class="px-2 py-2">Maximum</th>
                  <th scope="col" class="px-2 py-2">Days</th>
                  <th scope="col" class="px-2 py-2">Group</th>
                </tr>
              </thead>
              {CSVData.map((booking) => {
                return (
                  <tbody>
                    <tr class="border border-gray-800">
                      <th scope="row" class="px-2 py-2 text-center  font-medium whitespace-nowrap">
                        <h1>{bcount++}</h1>
                      </th>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-24'>{booking.name}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-24'>{booking.contact}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-24'>{booking.location}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-24'>{booking.flexibility}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-24'>{booking.notes}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-20'>{booking.checkIn}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-20'>{booking.checkOut}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-16'>{booking.people}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-16'>{booking.minimum}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-16'>{booking.maximum}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-16'>{booking.days}</h1>
                      </td>
                      <td class="px-2 py-2">
                        <h1 className='truncate w-28'>{booking.group}</h1>
                      </td>

                    </tr>
                  </tbody>
                );
              })}

            </table>
          </div>

          <div class="flex justify-end">

            <div type="submit" onClick={submitToFirebase} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border border-gray-800 rounded-full hover:text-white group hover:bg-gray-600">
              <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span class="relative">Submit</span>
            </div>
          </div>




        </div>



        <div class="w-screen px-40 py-10 flex justify-between items-center ">
          <div class="flex justify-between items-center ">
            <h1 class={`${inter.className} text-4xl font-bold `}>Existing Enquiry</h1>
          </div>

          <div class="flex justify-center items-center space-x-4">
            <select
              value={searchGroup}
              onChange={handleSearchGroupDropdown}
              className="block w-96 py-2 px-5 leading-tight border border-gray-300 focus:outline-none cursor-pointer"
            >
              {groupObj.map((group, index) => (
                <option key={index} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>

            <div class="px-4 py-2 cursor-pointer border border-gray-900 rounded-xl hover:bg-gray-300 " onClick={() => findBookings()} >
              <h1 class={`${inter.className} text-lg font-medium  `}>Search</h1>
            </div>
          </div>
        </div>


        {/* List of boxes */}
        <div class="grid grid-cols-4 gap-10 py-10 ">
          {bookingObj.map((booking) => (
            <div class="flex flex-col justify-center border border-gray-300 shadow-md min-w-[280px] h-[400px] px-5 space-y-2 rounded-lg ">
              <h1 class={`${inter.className} text-xl font-bold cursor-pointer`}>Name: {booking.name}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Contact: {booking.contact}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>No. Of People: {booking.people}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Budget Per Person: {booking.maximum}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>No. of Days: {booking.days}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Check In: {booking.checkIn}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Check Out: {booking.checkOut}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Location: {booking.location}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Flexibility: {booking.flexibility}</h1>
              <h1 class={`${inter.className} text-md font-medium  cursor-pointer `}>Notes: {booking.notes}</h1>

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

export default CreateBooking