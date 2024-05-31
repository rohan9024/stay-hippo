"use client"

import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../../components/Navbar';
import { Inter, Raleway } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { AuthContext } from "../../../contexts/AuthContext"
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Link from 'next/link';

import { Poppins } from 'next/font/google';
const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});

const raleway = Raleway({
    weight: ['400', '700'],
    subsets: ['latin'],
});

const inter = Inter({
    weight: ['400', '700'],
    subsets: ['latin'],
});


function page() {
    const router = useRouter();
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [createAccountModal, setCreateAccountModal] = useState(null)
    const [editAccountModal, setEditAccountModal] = useState(null)
    const [location, setLocation] = useState(null)
    const [villa, setVilla] = useState('N/A')
    const [editVilla, setEditVilla] = useState(null)
    const [active, setActive] = useState("ManageAccounts")
    const [fetch, setFetch] = useState(false)

    const { admin, setAdmin } = useContext(AuthContext);

    const notifySuccess = () => toast.success('Logged in successfully', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    const notifyError = () => toast.error('Invalid username or password', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    const notifyMissingCredentials = () => toast.error('Missing Credentials', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    const notifyMissingUsername = () => toast.error('Please Enter Username', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
    const notifyMissingPassword = () => toast.error('Please Enter Password', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });



    async function updateAdmin() {
        const docRef = doc(db, "admin", "a1SmQi09gQxBy7Q349s7");

        try {
            await updateDoc(docRef, {
                username: username,
                password: password,
            });

            alert('Updated the Credentials Successfully');

            setUsername('')
            setPassword('')
            window.location.reload();
        } catch (error) {
            alert('Unable to update');
        }
    }
    async function createVillaAccount() {
        if (username && password && villa && location) {

            try {
                await addDoc(collection(db, 'villaAccounts'), {
                    name: villa,
                    username: username.trim(),
                    password: password.trim(),
                    location: location.trim(),
                });
                alert('Created Villa Account Successfully');
                window.location.reload();
            } catch (error) {
                alert('Something went wrong');
            }
        }
        else {
            alert("Missing Details")
        }

    }
    async function updateAccount(account) {
        const docRef = doc(db, "villaAccounts", account.id);

        try {
            await updateDoc(docRef, {
                name: editVilla ? editVilla : account.name,
                location: location ? location.trim() : account.location,
                username: username ? username.trim() : account.username,
                password: password ? password.trim() : account.password,
            });
            alert('Updated Account Successfully');
            window.location.reload();
        } catch (error) {
            alert(error)
            alert('Unable to update');
        }

    }

    async function deleteAccount(villa) {
        var answer = window.confirm("Delete Villa?");
        if (answer) {
            await deleteDoc(doc(db, "villaAccounts", villa.id));
            window.location.reload();
        }
        else {
            return;
        }
    }


    const [accountObj, setAccountObj] = useState([])

    useEffect(() => {
        if (!fetch) {
            const fetchAccountObj = async () => {
                const querySnapshot = await getDocs(collection(db, "villaAccounts"));

                const fetchedAccounts = [];


                querySnapshot.forEach((doc) => {
                    fetchedAccounts.push({ id: doc.id, name: doc.data().name, username: doc.data().username, password: doc.data().password, location: doc.data().location });
                });

                setAccountObj(fetchedAccounts);
                console.log(fetchedAccounts)
                setFetch(true);
            }

            fetchAccountObj();
        }
    }, [fetch]);


    const [allVillasObj, setAllVillasObj] = useState([])

    useEffect(() => {
        if (!fetch) {
            const fetchVillaObj = async () => {
                const querySnapshot = await getDocs(collection(db, "villas"));

                const fetchedVillas = [{
                    id: 1, name: "N/A"
                }];

                querySnapshot.forEach((doc) => {
                    fetchedVillas.push({ id: doc.id, name: doc.data().name });
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
    const handleEditVillaDropdown = (event) => {
        setEditVilla(event.target.value);
    };


    async function deleteAllProfiles() {


        accountObj.map(async (data) => {
            await deleteDoc(doc(db, "villaAccounts", data.id));
        })

        alert("Deleted All Accounts Successfully")
        // window.location.reload();

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


            {
                createAccountModal && (
                    <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
                        <div className="w-full max-w-2xl bg-white rounded-lg  ">
                            <div class="relative bg-white rounded-lg  ">
                                <div class="flex items-start justify-between p-4 border-gray-800 border-b rounded-t ">
                                    <h3 class="text-xl font-semibold  ">
                                        Create Account
                                    </h3>
                                    <button onClick={() => setCreateAccountModal(null)} type="button" class=" bg-transparent hover:bg-gray-200 hover: rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>


                                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5 '>
                                    <h1 className={`${poppins.className} text-lg font-bold my-5`}>Enter Location</h1>

                                    <input
                                        onChange={(e) => setLocation(e.target.value)}
                                        value={location}
                                        type="text"
                                        placeholder="Lonavala"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96 bg-transparent"
                                    />


                                    <h1 className={`${poppins.className} text-lg font-bold my-5 `}>Select Villa</h1>

                                    <select
                                        value={villa}
                                        onChange={handleVillaDropdown}
                                        className="block w-96 py-2 px-5 leading-tight border border-gray-900   focus:outline-none cursor-pointer"
                                    >
                                        {allVillasObj.map((villa, index) => (
                                            <option key={index} value={villa.name}>
                                                {villa.name}
                                            </option>
                                        ))}
                                    </select>
                                    <h1 className={`${poppins.className} text-lg font-bold `}>Enter Username</h1>
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        type="text"
                                        placeholder="abc"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96 bg-transparent"
                                    />

                                    <h1 className={`${poppins.className} text-lg font-bold my-5 `}>Enter Password</h1>

                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="text"
                                        placeholder="abc"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96 bg-transparent"
                                    />

                                    <div type="submit" onClick={() => createVillaAccount()} class="text-black hover:text-white cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium  border-2 border-gray-900 rounded-full hover: group hover:bg-gray-600">
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
                editAccountModal && (
                    <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
                        <div className="w-full max-w-2xl bg-white rounded-lg  ">
                            <div class="relative bg-white rounded-lg  ">
                                <div class="flex items-start justify-between p-4 border-gray-900 border-b rounded-t ">
                                    <h3 class="text-xl font-semibold  ">
                                        Edit Account
                                    </h3>
                                    <button onClick={() => setEditAccountModal(null)} type="button" class=" bg-transparent hover: hover: rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>


                                <div className='flex flex-col space-y-5 my-5  mx-12 '>
                                    <h1 className={`${poppins.className} text-lg font-bold  `}>Enter Location</h1>

                                    <input
                                        onChange={(e) => setLocation(e.target.value)}
                                        value={location}
                                        type="text"
                                        placeholder="Lonavala"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border bg-transparent border-gray-800 w-96"
                                    />


                                    <h1 className={`${poppins.className} text-lg font-bold my-5 `}>Select Villa</h1>

                                    <select
                                        value={editVilla}
                                        onChange={handleEditVillaDropdown}
                                        className="block w-96 py-2 px-5 leading-tight border border-gray-900  focus:outline-none cursor-pointer"
                                    >
                                        {allVillasObj.map((villa, index) => (
                                            <option key={index} value={villa.name}>
                                                {villa.name}
                                            </option>
                                        ))}
                                    </select>
                                    <h1 className={`${poppins.className} text-lg font-medium `}>Enter Username</h1>
                                    <input
                                        onChange={(e) => setUsername(e.target.value)}
                                        value={username}
                                        type="text"
                                        placeholder="abc"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border bg-transparent border-gray-800 w-96"
                                    />

                                    <h1 className={`${poppins.className} text-lg font-bold my-5 `}>Enter Password</h1>

                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="text"
                                        placeholder="abc"
                                        className="placeholder:text-gray-500  px-5 py-2 outline-none border bg-transparent border-gray-800 w-96"
                                    />


                                    <div type="submit" onClick={() => updateAccount(editAccountModal)} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium  border-2 border-gray-900 rounded-full hover: group hover:bg-gray-600">
                                        <span class="absolute left-0 block w-full h-0 transition-all bg-gray-900 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
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


            <div className=' h-screen'>
                <div className='flex flex-col justify-center items-center w-screen  pt-20 space-y-5 '>
                    <div className='flex justify-center items-center space-x-10'>
                        <div onClick={() => setActive('ResetCredentials')} className={`${active === 'ResetCredentials' ? 'bg-blue-600  border-0 text-white' : ''} border border-gray-900 shadow-lg px-10 py-2 cursor-pointer hover:ease-in transition  hover:bg-gray-200`}>
                            <h1 class={`${poppins.className} text-lg font-medium cursor-pointer rounded-2xl `}>Reset your credentials</h1>
                        </div>
                        <div onClick={() => setActive('ManageAccounts')} className={`${active === 'ManageAccounts' ? 'bg-blue-600  border-0 text-white' : ''} border border-gray-900 shadow-lg px-10 py-2 cursor-pointer hover:ease-in transition  hover:bg-gray-200`}>
                            <h1 class={`${poppins.className} text-lg font-medium cursor-pointer  rounded-2xl 
                        `}>Manage accounts</h1>
                        </div>
                    </div>
                </div>


                {active === "ResetCredentials" && (<div className='flex flex-col justify-center items-center w-screen pt-24 space-y-5  '>
                    <h1 className={`${raleway.className} text-4xl font-bold mb-10`}>Reset your credentials </h1>
                    <form className='flex flex-col justify-center items-center space-y-10 '>
                        <input onChange={(e) => setUsername(e.target.value)} required type="text" placeholder="Enter Username" className={`${inter.className} placeholder:text-gray-800 px-5 py-2 bg-transparent  outline-none border border-gray-800 w-96`} />
                        <input onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className={`${inter.className} placeholder:text-gray-800 px-5 py-2 bg-transparent outline-none border border-gray-800 w-96`} />


                        <div onClick={updateAdmin} disabled={!username || !password} type="submit" class="cursor-pointer relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium  border-2 border-gray-900 rounded-full hover:text-white group hover:bg-gray-700 w-96 mx-auto">
                            <span class="absolute left-0 block w-full h-0 transition-all bg-gray-900 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                            <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span class="relative text-center">Change Credentials</span>
                        </div>

                    </form>
                </div>)

                }
                {active === "ManageAccounts" && (
                    <>
                        <div class="w-screen px-44 py-10 flex flex-col my-10  ">
                            <div class="flex justify-between items-center ">
                                <h1 class={`${poppins.className} text-4xl font-bold `}>Manage Accounts</h1>
                                <div class="flex justify-center items-center space-x-5">
                                    <div onClick={() => { setCreateAccountModal(true); setEditAccountModal(false); }} className='flex justify-center items-center px-5 py-2 border border-gray-900 transition hover:ease-in hover:bg-gray-200  shadow-md rounded-lg  cursor-pointer'>
                                        <h1 class={`${poppins.className} text-md  `}>Create New Account</h1>
                                    </div>
                                    <div onClick={deleteAllProfiles} className='bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2  transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg  cursor-pointer'>
                                        <h1 class={`${poppins.className} text-md  `}>Delete All Profiles</h1>
                                    </div>

                                </div>
                            </div>



                            {/* List of boxes */}
                            <div class="grid grid-cols-4 gap-10 py-14 ">
                                {accountObj.map((account) => {

                                    return account.id !== 1 && (<div class="flex flex-col justify-center border border-gray-300 shadow-lg min-w-[250px] h-[220px] px-5 rounded-lg ">
                                        <h1 class={`${poppins.className} text-md font-medium  cursor-pointer`}>Villa: {account.name}</h1>
                                        <h1 class={`${poppins.className} text-md font-medium  cursor-pointer`}>Location: {account.location}</h1>
                                        <h1 class={`${poppins.className} text-md font-medium  cursor-pointer`}>Username: {account.username}</h1>
                                        <h1 class={`${poppins.className} text-md font-medium  cursor-pointer`}>Password: {account.password}</h1>

                                        <div className='flex justify-end items-end space-x-2'>

                                            <div class="mt-10 cursor-pointer " onClick={() => setEditAccountModal(account)} >
                                                <img src="/edit.png" alt="edit" className='w-7 h-7' />
                                            </div>
                                            <div class="mt-10 cursor-pointer " onClick={() => deleteAccount(account)} >
                                                <img src="/delete.png" alt="delete" className='w-7 h-7' />
                                            </div>
                                        </div>

                                    </div>)
                                }
                                )}
                            </div>
                        </div>
                    </>


                )}
            </div>
        </>

    )
}

export default page