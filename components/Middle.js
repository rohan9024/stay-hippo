"use client"
import React, { useEffect, useState } from 'react'
import { Poppins } from 'next/font/google';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

const poppins = Poppins({
  weight: ['100', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});


function Middle() {
  const [active, setActive] = useState("Overview")
  const [itemModal, setItemModal] = useState(false)
  const [itemName, setItemName] = useState("")
  const [editGroup, setEditGroup] = useState(null)
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

  const groupedVillas = villaObj.reduce((acc, villa) => {
    if (!acc[villa.group]) {
      acc[villa.group] = [];
    }
    acc[villa.group].push(villa);
    return acc;
  }, {});



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
  async function editGroupRequest(id, group) {


    // Update the doc first
    const docRef = doc(db, "groups", id);

    try {
      await updateDoc(docRef, {
        name: groupName,
      });

    } catch (error) {
      alert(error)
      alert('Unable to update');
    }


    // Find and update docs

    const q = query(
      collection(db, "villas"),
      where("group", "==", group),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Not found");
    } else {
      const fetchedVillas = [];

      querySnapshot.forEach((doc) => {
        fetchedVillas.push(doc.id);
      });

      fetchedVillas.forEach(async (document) => {
        const docRef = doc(db, "villas", document);

        await updateDoc(docRef, {
          group: groupName,
        });
      });

      alert("Updated Group Name Successfully")
      window.location.reload();


    }

  }
  async function deleteGroupRequest(id, group) {


    // Update the doc first
    const docRef = doc(db, "groups", id);

    try {
      await deleteDoc(docRef, {
        name: groupName,
      });

    } catch (error) {
      alert(error)
      alert('Unable to update');
    }


    // Find and update docs

    const q = query(
      collection(db, "villas"),
      where("group", "==", group),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Deleted Group Successfully")
      window.location.reload();
    } else {
      const fetchedVillas = [];

      querySnapshot.forEach((doc) => {
        fetchedVillas.push(doc.id);
      });

      fetchedVillas.forEach(async (document) => {
        const docRef = doc(db, "villas", document);

        await deleteDoc(docRef);
      });

      alert("Deleted Group Successfully")
      window.location.reload();


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
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50   bg-opacity-80 `}>
            <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
              <div class="relative bg-white rounded-lg  border border-gray-300">
                <div class="flex items-start justify-between p-4  rounded-t ">
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
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 w-96"
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
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 border border-gray-700 bg-opacity-80 `}>
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
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 w-96"
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
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 border border-gray-700 bg-opacity-80 `}>
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
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 w-96"
                  />
                  <h1 className={`${poppins.className} text-lg font-medium`}>Enter Group Name</h1>
                  <input
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                    type="text"
                    placeholder="Group 1"
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 w-96"
                  />

                  <div type="submit" onClick={() => editVillaRequest(editVilla.id)} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
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
        editGroup && (
          <div className={`${poppins.className} fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-gray-900 border border-gray-700 bg-opacity-80 `}>
            <div className="w-full max-w-2xl bg-white rounded-lg shadow ">
              <div class="relative bg-white rounded-lg shadow ">
                <div class="flex items-start justify-between p-4 border-b rounded-t ">
                  <h3 class="text-xl font-semibold text-gray-900 ">
                    Edit Villa Details
                  </h3>
                  <button onClick={() => setEditGroup(null)} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center " data-modal-hide="default-modal">
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
                    className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-300 w-96"
                  />
                  <div type="submit" onClick={() => editGroupRequest(editGroup.id, editGroup.name)} class=" cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
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
            <div onClick={() => { setGroupModal(true); setVillaModal(false); }} className='flex justify-center items-center px-5 py-2 border border-gray-300 transition hover:ease-in hover:bg-gray-300  shadow-md rounded-lg  cursor-pointer'>
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

                    <div class="mt-10 cursor-pointer " onClick={() => setEditGroup(group)} >
                      <img src="/edit.png" alt="edit" className='w-7 h-7' />
                    </div>
                    <div class="mt-10 cursor-pointer " onClick={() => deleteGroupRequest(group.id, group.name)} >
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
            <div onClick={() => { setVillaModal(true); setGroupModal(false); }} className='flex justify-center items-center px-5 py-2 border border-gray-300 transition hover:ease-in hover:bg-gray-300  shadow-md rounded-lg  cursor-pointer'>
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
      <div class="w-screen px-44 py-10 flex flex-col ">
        <div class="flex justify-between items-center ">
          <h1 class={`${poppins.className} text-4xl font-bold `}>View Groups-Villas</h1>
          <div class="flex justify-center items-center space-x-5">
            <div onClick={() => { setVillaModal(true); setGroupModal(false); }} className='flex justify-center items-center px-5 py-2 border border-gray-300 transition hover:ease-in hover:bg-gray-300  shadow-md rounded-lg  cursor-pointer'>
              <h1 class={`${poppins.className} text-md  `}>Create New Villa</h1>
            </div>

          </div>
        </div>
        {/* {Object.keys(groupedVillas).map((group) => (
          <div key={group}>
            <h2>{group}</h2>
            <ul>
              {groupedVillas[group].map((villa) => (
                <li key={villa.id}>{villa.name}</li>
              ))}
            </ul>
          </div>
        ))} */}


        {/* List of boxes */}
        <div class="grid grid-cols-4 gap-10 py-14">
          {Object.keys(groupedVillas).map((group) => (
            <div key={group} className="flex flex-col justify-center border border-gray-300 shadow-md min-w-[250px] h-[150px] px-5 rounded-lg space-y-2">
              <h1 class={`${poppins.className} text-xl font-bold cursor-pointer`}>{group}</h1>
              <div className="flex flex-wrap gap-4">
                {groupedVillas[group].map((villa) => (
                  <div key={villa.id} className='flex flex-col ' >
                    <h1 class={`${poppins.className} text-lg font-normal cursor-pointer`}>{villa.name}</h1>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>



      </div>
    </>

  )
}

export default Middle