"use client";

import React, { useEffect, useState } from "react";
import { Poppins, Raleway } from "next/font/google";
import Link from "next/link";
import { motion } from "framer-motion";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const raleway = Raleway({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

function page() {
  const [menu, setMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name, "Phone:", phone);
    toggleModal();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  async function submitCallback() {
    if ((name, phone)) {
      try {
        await addDoc(collection(db, "callbacks"), {
          phone,
          name,
        });

        alert("We will contact you soon!");
      } catch (error) {
        alert("Something went wrong");
      }
    } else {
      alert("Something is missing.");
    }
  }

  const handleClick = () => {
    const url = `https://wa.me/9619128258`;
    window.open(url, "_blank");
  };
  return (
    <div className="flex flex-col h-screen ">
      <div className="z-20 fixed ">
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-0 "
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg relative md:px-20 md:py-12"
            >
              <button
                onClick={toggleModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 w-5 h-5"
              >
                <img src="/close.png" alt="close" className="w-5 h-5" />{" "}
              </button>
              <h2 className="text-2xl font-bold mb-4 md:mb-7">
                Request a Callback
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Whatsapp No.</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter your Whatsapp No."
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={submitCallback}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className="w-screen py-6 px-10 flex justify-between items-center">
        <Link
          href="/"
          className={`${raleway.className} text-2xl font-bold cursor-pointer`}
        >
          Luna
        </Link>

        <div className="hidden md:flex justify-center items-center space-x-10">
          <Link
            href="/about-us"
            className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            About Us
          </Link>
          <a
            href="https://www.sagarrchavan.in/courses/475162"
            className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            Education
          </a>
          <a
            href="https://www.youtube.com/watch?v=8OBSI8CNmHY&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=25"
            className={`${poppins.className} hidden md:flex text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            Youtube
          </a>
          <Link
            href="/terms-conditions"
            className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            Terms & Conditions
          </Link>
        </div>

        <div className="md:hidden ">
          {menu ? (
            <img
              src="/close.png"
              alt="close"
              className="w-5 h-5"
              onClick={() => setMenu(false)}
            />
          ) : (
            <img
              src="/menu.png"
              alt="menu"
              className="w-5 h-5"
              onClick={() => setMenu(true)}
            />
          )}
        </div>
      </div>

      <div className="bg-gray-900 h-[1px]" />
      {menu ? (
        <div className="flex flex-col justify-start items-center h-screen my-10 space-y-10 ">
          <Link
            href="/about-us"
            className={`${poppins.className}text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            About Us
          </Link>
          <a
            href="https://www.sagarrchavan.in/courses/475162"
            className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            Education
          </a>
          <a
            href="https://www.youtube.com/watch?v=8OBSI8CNmHY&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=25"
            className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            Youtube
          </a>
          <Link
            href="/terms-conditions"
            className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}
          >
            Terms & Conditions
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center w-screen  border-t border-gray-800">
            <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:mx-64 mx-6 h-[600px]">
              <h1 className={`${poppins.className} text-5xl font-bold`}>
                Welcome to Luna!
              </h1>
              <h1 className={`${poppins.className} text-md font-normal`}>
                {" "}
                At the heart of our mission, we strive to simplify and
                streamline the connection between villa owners and travelers
                seeking the perfect getaway. Recognizing the unique challenges
                that villa owners face in the hospitality industry, Luna has
                developed a robust, hassle-free solution for connecting with
                potential guests without the time-consuming tasks typically
                associated with bookings and advertising.
              </h1>
            </div>
            <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] bg-pink-200">
              <h1 className={`${poppins.className} text-5xl font-bold`}>
                Our Vision
              </h1>
              <h1 className={`${poppins.className} text-md font-normal`}>
                {" "}
                At the heart of our mission, we strive to simplify and
                streamline the connection between villa owners and travelers
                seeking the perfect getaway. Recognizing the unique challenges
                that villa owners face in the hospitality industry, Luna has
                developed a robust, hassle-free solution for connecting with
                potential guests without the time-consuming tasks typically
                associated with bookings and advertising.
              </h1>
            </div>
            <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] ">
              <h1 className={`${poppins.className} text-5xl font-bold`}>
                What We Do
              </h1>
              <h1 className={`${poppins.className} text-md font-normal`}>
                Luna operates at the intersection of technology and personal
                touch. We utilize both online and offline mediums to gather
                detailed traveler inquiries, including their preferred
                destinations, budget, and specific needs. This data is
                meticulously compiled and directly sent to villa owners as
                pre-qualified leads, ensuring that every interaction they have
                is with a potential guest whose requirements match what they
                offer. Our unique lead generation tool is live, quick, and
                efficient, cutting through the clutter to deliver only what's
                relevant. Villa owners receive these leads without the need to
                engage in time-consuming activities such as: Creating and
                managing advertisements, Running costly and often ineffective
                marketing campaigns, Shifting through endless inquiries to find
                genuine prospects, Wasting time on interactions that do not
                convert into bookings
              </h1>
            </div>
            <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] bg-pink-200">
              <h1 className={`${poppins.className} text-5xl font-bold`}>
                Why Choose Luna?
              </h1>
              <h1 className={`${poppins.className} text-md font-normal`}>
                Choosing Luna means choosing simplicity and efficiency. We are
                more than just a service; we are a partner in your business
                growth. By entrusting us with the intricacies of guest
                acquisition, villa owners can focus more on what they do
                best—providing an exceptional experience for their guests. Our
                system not only saves time but also reduces the overhead costs
                associated with acquiring new guests. With Luna, you no longer
                need to invest in widespread marketing efforts or spend hours in
                front of a computer filtering through leads. Instead, you
                receive streamlined, direct access to a pool of interested
                travelers, all matched to your villa’s offerings and criteria.
              </h1>
            </div>

            <div className="flex flex-col flex-grow justify-center items-center my-10 space-y-10 lg:px-64 px-6 h-[600px] ">
              <h1 className={`${poppins.className} text-5xl font-bold`}>
                Join Us
              </h1>
              <h1 className={`${poppins.className} text-md font-normal`}>
                Step into the future of villa bookings with Luna. Let us handle
                the complexities of lead generation and guest acquisition while
                you enjoy the benefits of increased bookings and satisfied
                guests. Connect with us today to learn how Luna can transform
                your villa into a thriving haven for travelers. Together, let's
                redefine hospitality and create unforgettable experiences for
                guests while achieving your business goals with ease.
              </h1>
            </div>
          </div>

          <motion.div
            className="w-screen p-5 pb-5 flex justify-end items-center bottom-16 fixed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleClick}
          >
            <img
              src="/whatsapp.png"
              alt="whatsapp"
              className="w-12 h-12 rounded-full"
            />
          </motion.div>
          <div className="w-screen md:py-4 py-6 flex justify-center items-center border-t border-gray-900 ">
            <div className="flex flex-col items-center">
              <h1 className={`${poppins.className} text-md font-medium`}>
                Copyright © 2024, Luna, All rights reserved.
              </h1>
              {/* 
                                <div className='flex justify-center items-center space-x-4 mt-3'>
                                    <h1 className={`${poppins.className} text-sm font-medium`}>For any queries,</h1>
                                    <div class=" cursor-pointer flex items-center " >
                                        <img src="/whatsapp.svg" alt="whatsapp" className='w-7 h-7' />
                                        <h1 className={`${poppins.className} text-sm font-medium ml-1`}> +919619128258.</h1>
                                    </div>
                                </div> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default page;
