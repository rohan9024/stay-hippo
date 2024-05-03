"use client"
import React, { useEffect, useState } from 'react'
import { Poppins } from 'next/font/google';
import { useRouter } from 'next/navigation';
import Select from 'react-select'
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const poppins = Poppins({
  weight: ['100', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});


function VillaMiddle() {
  const router = useRouter();
  const [fetch, setFetch] = useState(false)
  const [selectedTab, setSelectedTab] = useState(null)
  const [department, setDepartment] = useState("CE")
  const [fetchDept, setFetchDept] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])
  const [item, setItem] = useState("N/A")
  const [quantity, setQuantity] = useState(1);

  const [inventoryObj, setInventoryObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchInventoryObj = async () => {
        const querySnapshot = await getDocs(collection(db, "inventory"));
        const fetchedInventory = [{
          id: 1, item: "N/A", stock: -1
        }];

        querySnapshot.forEach((doc) => {
          fetchedInventory.push({ id: doc.id, item: doc.data().item, stock: doc.data().stock });
        });

        setInventoryObj(fetchedInventory);
        setFetch(true);
      }

      fetchInventoryObj();
    }
  }, [fetch]);



  const [deptObj, setDeptObj] = useState([])

  useEffect(() => {
    if (!fetch) {
      const fetchDeptObj = async () => {
        const querySnapshot = await getDocs(collection(db, "departments"));
        const fetchedDept = [];

        querySnapshot.forEach((doc) => {
          fetchedDept.push({ id: doc.id, name: doc.data().name });
        });

        setDeptObj(fetchedDept);
        setFetch(true);
      }

      fetchDeptObj();
    }
  }, [fetch]);




  const handleDepartmentDropdown = (event) => {
    setDepartment(event.target.value);
  };
  const handleItemDropdown = (event) => {
    setItem(event.target.value);
  };


  async function requestAdmin() {
    alert(item)
    //   if (item && quantity ) {
    //     try {
    //       await addDoc(collection(db, 'requests'), {
    //         item: item,
    //         quantity: quantity,
    //         department: department,
    //       });
    //       window.location.reload();
    //     } catch (error) {
    //       alert('Something went wrong');
    //     }
    //   }

    // alert("Submitted Successfully")
    // window.location.reload();

  }



  return (
    <>
      <div class="w-screen px-44 py-10 flex flex-col ">
        <div class="flex flex-col justify-center items-center ">

          <h1 class={`${poppins.className} text-4xl font-bold `}>Request Admin</h1>


          <div className='flex flex-col justify-start items-start my-14 '>

            <h1 className={`${poppins.className} text-lg font-bold my-5`}>Select Department</h1>

            <select
              value={department}
              onChange={handleDepartmentDropdown}
              className="block w-96 py-2 px-5 leading-tight border border-gray-700 focus:outline-none cursor-pointer"
            >
              {deptObj.map((dept, index) => (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>


            <h1 className={`${poppins.className} text-lg font-bold my-5`}>Select Item</h1>

            <select
              value={item}
              onChange={handleItemDropdown}
              className="block w-96 py-2 px-5 leading-tight border border-gray-700 focus:outline-none cursor-pointer"
            >
              {inventoryObj.map((item, index) => (
                <option key={index} value={item.item} >
                  {item.item}
                </option>
              ))}
            </select>



            <h1 className={`${poppins.className}  text-lg font-bold my-5`}>Enter Quantity</h1>

            <input
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              type="number"
              className="placeholder:text-gray-500  px-5 py-2 outline-none border border-gray-800 w-96"
            />


            <div type="submit" onClick={requestAdmin} class="my-10 cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600">
              <span class="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
              <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span class="relative">Request Admin</span>
            </div>


          </div>

        </div>




      </div>
    </>

  )
}

export default VillaMiddle