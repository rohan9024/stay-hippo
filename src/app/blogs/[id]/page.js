"use client"; // Indicates this component should be rendered on the client side

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Poppins } from "next/font/google";
import Navbar from "../../../../components/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

function BlogProps() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // useSearchParams to get query parameters
  const id = searchParams.get("id"); // Get the id from query parameters

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return; // Do nothing if ID is not available

      try {
        const blogRef = doc(db, "blogs", id);
        const blogDoc = await getDoc(blogRef);

        if (blogDoc.exists()) {
          setBlog(blogDoc.data());
        } else {
          setError("No such document!");
        }
      } catch (error) {
        setError("Error fetching blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return <p>No blog found.</p>;

  return (
    <div className="flex flex-col h-screen px-7 py-10">

      {/* Visible to mobile screens */}

      <div className="md:hidden flex justify-start items-center pb-5">
        <Link
          href="/blogs"
          className="object-contain rounded-full cursor-pointer p-2 hover:bg-gray-300 dark:bg-white"
        >
          <img
            src="/back.png"
            alt="back icon"
            className="w-7 h-7 object-contain"
          />
        </Link>
      </div>

      <div className="md:hidden w-full flex flex-col items-center">
        <img
          src={blog.imageUrl || "/default-image.png"} // Use a default image if no image URL is provided
          alt={blog.title || "Blog Image"}
          className="w-[350px] h-[250px] object-cover rounded-lg"
        />
        <h1 className={`${poppins.className} text-lg font-bold pt-4`}>
          {blog.title || "No title available"}
        </h1>
        <p
          className={`${poppins.className} text-sm font-normal text-gray-400 pt-2 pb-7`}
        >
          {blog.desc || "No description available"}
        </p>
      </div>


      {/* Visible to large screens */}
      <div className="hidden md:flex justify-start items-center pb-5">
        <Link
          href="/blogs"
          className="object-contain rounded-full cursor-pointer p-2 hover:bg-gray-300 dark:bg-white"
        >
          <img
            src="/back.png"
            alt="back icon"
            className="w-7 h-7 object-contain"
          />
        </Link>
      </div>

      <div className="hidden  w-full md:flex flex-col items-center space-y-5 md lg:px-20 xl:px-44">
        <img
          src={blog.imageUrl || "/default-image.png"} // Use a default image if no image URL is provided
          alt={blog.title || "Blog Image"}
          className="w-[750px] h-[450px] object-cover rounded-lg"
        />
        <h1 className={`${poppins.className} text-3xl font-bold pt-4`}>
          {blog.title || "No title available"}
        </h1>
        <p
          className={`${poppins.className} text-xl font-normal text-gray-700 pt-2 pb-7 px-20`}
        >
          {blog.desc || "No description available"}
        </p>
      </div>
    </div>
  );
}

export default BlogProps;
