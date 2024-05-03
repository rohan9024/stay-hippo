"use client"
import React, { useEffect, useState } from 'react'
import { Poppins } from 'next/font/google';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const poppins = Poppins({
  weight: ['100', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});


function Middle() {
  const [active, setActive] = useState("Overview")
  const [itemModal, setItemModal] = useState(false)
  const [itemName, setItemName] = useState("")
  const [editModal, setEditModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [editVilla, setEditVilla] = useState(null)
  const [item, setItem] = useState("")
  const [stock, setStock] = useState(0)
  const [inventoryName, setInventoryName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [villaModal, setVillaModal] = useState(false)
  const [groupModal, setGroupModal] = useState(false)
  const [group, setGroup] = useState("N/A")
  const [villaName, setVillaName] = useState("")
  const [groupName, setGroupName] = useState("")
  const [fetch, setFetch] = useState(false)


  const [inventoryObj, setInventoryObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchInventoryObj = async () => {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const fetchedInventory = [];

        querySnapshot.forEach((doc) => {
          fetchedInventory.push({ id: doc.id, item: doc.data().item, stock: doc.data().stock });
        });

        setInventoryObj(fetchedInventory);
        setFetch(true);
      }

      fetchInventoryObj();
    }
  }, [fetch]);


  const [villaObj, setVillaObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchVillaObj = async () => {
        const querySnapshot = await getDocs(collection(db, "villas"));
        const fetchedVillas = [];


        querySnapshot.forEach((doc) => {
          fetchedVillas.push({ id: doc.id, name: doc.data().name, group: doc.data().group });
        });

        setVillaObj(fetchedVillas);
        setFetch(true);
      }

      fetchVillaObj();
    }
  }, [fetch]);


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





  const createItem = async () => {
    if (item && stock) {
      try {
        await addDoc(collection(db, 'inventory'), {
          item: item,
          stock: stock
        });
        alert('Created Item successfully');
        window.location.reload();
      } catch (error) {
        alert('Something went wrong');
      }
    }
  };
  const createVilla = async () => {
    if (villaName) {
      try {
        await addDoc(collection(db, 'villas'), {
          name: villaName,
          group: group,
        });
        alert('Created Villa Successfully');
        window.location.reload();
      } catch (error) {
        alert('Something went wrong');
      }
    }
  };
  const createGroup = async () => {
    if (groupName) {
      try {
        await addDoc(collection(db, 'groups'), {
          name: groupName,
        });
        alert('Created Group Successfully');
        window.location.reload();
      } catch (error) {
        alert('Something went wrong');
      }
    }
  };


  async function editVillaRequest(id, name, group) {

    const docRef = doc(db, "villas", id);

    try {
      await updateDoc(docRef, {
        name: villaName ? villaName : name,
        group: groupName ? groupName : group,
      });

      alert('Updated the Villa successfully');
      window.location.reload();
    } catch (error) {
      alert(error)
      alert('Unable to update');
    }
  }

  async function updateDept(editDept) {
    const docRef = doc(db, "departments", editDept.id);

    try {
      await updateDoc(docRef, {
        name: villaName,
      });

      alert('Updated the Department Successfully');
      window.location.reload();
    } catch (error) {
      alert('Unable to update');
    }
  }


  async function deleteItem(item) {
    var answer = window.confirm("Delete Item?");
    if (answer) {
      await deleteDoc(doc(db, "inventory", item.id));
      window.location.reload();
    }
    else {
      return;
    }
  }
  async function deleteVilla(villa) {
    var answer = window.confirm("Delete Villa?");
    if (answer) {
      await deleteDoc(doc(db, "villa", villa.id));
      window.location.reload();
    }
    else {
      return;
    }
  }


  const handleGroupDropdown = (event) => {
    setGroup(event.target.value);
  };

  return (
    <>

      {
        villaModal && (
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
            <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
              <div class="relative bg-white rounded-lg shadow ">
                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                  <h3 class="text-xl font-semibold text-gray-900 ">
                    Create New Villa
                  </h3>
                  <button onClick={() => setVillaModal(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>
                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5'>
                  <h1 className={`${poppins.className} text-lg font-medium`}>Enter Villa Name</h1>
                  <input
                    onChange={(e) => setVillaName(e.target.value)}
                    value={villaName}
                    type="text"
                    placeholder="Saj Villa"
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
                  />

                  <h1 className={`${poppins.className} text-lg font-bold my-5`}>Select Group</h1>

                  <select
                    value={group}
                    onChange={handleGroupDropdown}
                    className="block w-96 py-2 px-5 leading-tight border border-gray-700 focus:outline-none cursor-pointer"
                  >
                    {groupObj.map((group, index) => (
                      <option key={index} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>

                  <div type="submit" onClick={() => createVilla()} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
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
        groupModal && (
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
            <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
              <div class="relative bg-white rounded-lg shadow ">
                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                  <h3 class="text-xl font-semibold text-gray-900 ">
                    Create New Group
                  </h3>
                  <button onClick={() => setGroupModal(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>
                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5'>
                  <h1 className={`${poppins.className} text-lg font-medium`}>Enter Group Name</h1>
                  <input
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                    type="text"
                    placeholder="Group 1"
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
                  />

                  <div type="submit" onClick={() => createGroup()} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
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
        editVilla && (
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-80 `}>
            <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
              <div class="relative bg-white rounded-lg shadow ">
                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                  <h3 class="text-xl font-semibold text-gray-900 ">
                    Edit Villa Details
                  </h3>
                  <button onClick={() => setEditVilla(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                  </button>
                </div>
                <div className='flex flex-col space-y-5 mb-20  mx-12 my-5'>
                  <h1 className={`${poppins.className} text-lg font-medium`}>Enter Villa Name</h1>
                  <input
                    onChange={(e) => setVillaName(e.target.value)}
                    value={villaName}
                    type="text"
                    placeholder="Saj Villa"
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
                  />
                  <h1 className={`${poppins.className} text-lg font-medium`}>Enter Group Name</h1>
                  <input
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                    type="text"
                    placeholder="Group 1"
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
                  />

                  <div type="submit" onClick={() => editVillaRequest(editVilla.id, editVilla.name, editVilla.group)} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
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


      <div class="w-screen px-44 py-10 flex flex-col ">
        <div class="flex justify-between items-center ">
          <h1 class={`${poppins.className} text-4xl font-bold `}>Existing Groups</h1>
          <div class="flex justify-center items-center space-x-5">
            <div onClick={() => { setGroupModal(true); setVillaModal(false); }} className='flex justify-center items-center px-5 py-2 border border-gray-300 transition hover:ease-in hover:bg-gray-100  shadow-md rounded-lg  cursor-pointer'>
              <h1 class={`${poppins.className} text-md  `}>Create New Group</h1>
            </div>
          </div>
        </div>



        {/* List of boxes */}
        <div class="grid grid-cols-4 gap-10 py-14 ">
          {groupObj.map((group) => {
            return group.id !== 1 &&
              (
                <div class="flex flex-col justify-center border border-gray-300 shadow-md min-w-[250px] h-[150px] px-5 rounded-lg ">
                  <h1 class={`${poppins.className} text-xl font-bold cursor-pointer`}>{group.name}</h1>

                  <div className='flex justify-end items-end space-x-2'>

                    <div class="mt-10 cursor-pointer " onClick={() => setEditItem(item)} >
                      <img src="/edit.png" alt="edit" className='w-7 h-7' />
                    </div>
                    <div class="mt-10 cursor-pointer " onClick={() => deleteItem(item)} >
                      <img src="/delete.png" alt="delete" className='w-7 h-7' />
                    </div>
                  </div>

                </div>
              )
          })}
        </div>
      </div>
      <div class="w-screen px-44 py-10 flex flex-col ">
        <div class="flex justify-between items-center ">
          <h1 class={`${poppins.className} text-4xl font-bold `}>Existing Villas</h1>
          <div class="flex justify-center items-center space-x-5">
            <div onClick={() => { setVillaModal(true); setGroupModal(false); }} className='flex justify-center items-center px-5 py-2 border border-gray-300 transition hover:ease-in hover:bg-gray-100  shadow-md rounded-lg  cursor-pointer'>
              <h1 class={`${poppins.className} text-md  `}>Create New Villa</h1>
            </div>

          </div>
        </div>



        {/* List of boxes */}
        <div class="grid grid-cols-4 gap-10 py-14 ">
          {villaObj.map((villa) => (
            <div class="flex flex-col justify-center border border-gray-300 shadow-md min-w-[250px] h-[150px] px-5 rounded-lg ">
              <h1 class={`${poppins.className} text-xl font-bold cursor-pointer`}>{villa.name}</h1>
              <h1 class={`${poppins.className} text-xl font-bold cursor-pointer`}>{villa.group}</h1>

              <div className='flex justify-end items-end space-x-2'>

                <div class="mt-10 cursor-pointer " onClick={() => setEditVilla(villa)} >
                  <img src="/edit.png" alt="edit" className='w-7 h-7' />
                </div>
                <div class="mt-10 cursor-pointer " onClick={() => deleteVilla(villa)} >
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

export default Middle