"use client"; // Indicates this component should be rendered on the client side

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inter, Poppins, Raleway } from "next/font/google";
import Link from "next/link";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

const raleway = Raleway({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const inter = Inter({
  weight: ["400", "700"],
  subsets: ["latin"],
});
const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

function Page() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"));
        const querySnapshot = await getDocs(q);
        const fetchedBlogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs.");
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="md:hidden flex justify-center items-center">
        <Link
          href="/"
          className="object-contain rounded-full cursor-pointer p-2 transition hover:bg-gray-300 dark:bg-white hover:duration-150"
        >
          <img
            src="/back.png"
            alt="back icon"
            className="w-7 h-7 object-contain"
          />
        </Link>

        <h1
          className={`${poppins.className} text-2xl tracking-wide font-semibold md:text-3xl text-center p-10`}
        >
          Recent Blogs
        </h1>
      </div>


      <div
        className={`${poppins.className} md:grid md:grid-cols-3 md:gap-10 w-screen px-7 pb-10`}
      >
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <Link
              href={{
                pathname: `/blogs/${blog.id}`,
                query: {
                  id: blog.id,
                },
              }}
              key={blog.id}
              className="w-full flex flex-col items-center"
            >
              <img
                src={blog.imageUrl || "/default-image.png"} // Use a default image if no image URL is provided
                alt={blog.title}
                className="w-[350px] h-[250px] object-cover rounded-lg"
              />
              <h1 className={`${poppins.className} text-lg font-bold pt-4`}>
                {blog.title}
              </h1>
              <h1
                className={`${poppins.className} text-sm font-normal text-gray-400 pt-2 pb-7`}
              >
                {blog.desc.length > 100
                  ? `${blog.desc.substring(0, 100)}...`
                  : blog.desc}
              </h1>
            </Link>
          ))
        ) : (
          <p
            className={`${poppins.className} text-xl font-bold text-center w-full`}
          >
            No blogs available.
          </p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Page;
