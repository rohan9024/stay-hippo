import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase"; // Adjust path as needed
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Poppins, Raleway } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const raleway = Raleway({
  weight: ["100", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const Modal = ({ isOpen, onClose, onSave, title, desc, setTitle, setDesc }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Title"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="New Description"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
          />
          <div className="flex justify-end">
            <button
              onClick={onSave}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
function CreateBlogs() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
  
    const handleFileChange = (e) => {
      if (e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleSubmit = async () => {
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }
  
      setUploading(true);
      const imageId = uuidv4(); // Generate a unique ID for the image
      const imageRef = ref(storage, `images/${imageId}_${file.name}`);
  
      // Create an upload task
      const uploadTask = uploadBytesResumable(imageRef, file);
  
      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading file:", error);
          alert("Failed to upload file.");
          setUploading(false);
        },
        async () => {
          // File upload completed successfully
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
  
          try {
            // Add document to Firestore
            await addDoc(collection(db, "blogs"), {
              title,
              desc,
              imageUrl,
              timestamp: serverTimestamp(), // Add timestamp
            });
  
            alert("Blog created successfully!");
            fetchBlogs(); // Fetch blogs after adding new one
          } catch (error) {
            console.error("Error creating blog:", error);
            alert("Failed to create blog.");
          } finally {
            setUploading(false);
          }
        }
      );
    };
  
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          orderBy("timestamp", "desc"), // Order by timestamp
          limit(5) // Limit to the most recent 5 blogs
        );
        const querySnapshot = await getDocs(q);
        const fetchedBlogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(fetchedBlogs);
  
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
  
    useEffect(() => {
      fetchBlogs(); // Fetch blogs when component mounts
    }, []);
  
    const deleteBlog = async (id) => {
      try {
        await deleteDoc(doc(db, "blogs", id));
        alert("Blog deleted successfully!");
        fetchBlogs(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog.");
      }
    };
  
    const openEditModal = (blog) => {
      setCurrentBlog(blog);
      setNewTitle(blog.title);
      setNewDesc(blog.desc);
      setIsModalOpen(true);
    };
  
    const saveChanges = async () => {
      if (!currentBlog) return;
  
      try {
        const blogRef = doc(db, "blogs", currentBlog.id);
        await updateDoc(blogRef, {
          title: newTitle,
          desc: newDesc,
        });
  
        alert("Blog updated successfully!");
        fetchBlogs(); // Refresh the list after updating
      } catch (error) {
        console.error("Error updating blog:", error);
        alert("Failed to update blog.");
      } finally {
        setIsModalOpen(false);
      }
    };
  
    const deleteAllBlogs = async () => {
      try {
        // Fetch all documents
        const q = collection(db, "blogs");
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.empty) {
          alert("No blogs to delete.");
          return;
        }
  
        // Delete each document individually
        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref);
        }
  
        alert("All blogs have been deleted!");
        fetchBlogs(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting blogs:", error);
        alert("Failed to delete blogs.");
      }
    };
  
    return (
      <div className="flex flex-col justify-center items-center h-2/3 px-20">
        {/* Input Fields for Title and Description */}
        <div className="flex justify-center items-center space-x-5 mt-32 mb-10">
          <div className="flex flex-col justify-start items-start space-y-4">
            <h1 className="text-md font-bold">Enter Title</h1>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              placeholder="Title"
              className="placeholder:text-gray-500 px-5 py-2 outline-none border border-gray-300 bg-transparent w-96 rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-start items-start space-y-4">
            <h1 className="text-md font-bold">Enter Description</h1>
            <input
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              type="text"
              placeholder="Description"
              className="placeholder:text-gray-500 px-5 py-2 outline-none border border-gray-300 bg-transparent w-96 rounded-lg"
            />
          </div>
        </div>
  
        {/* File Upload Section */}
        <div className="flex items-center justify-center w-2/3">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
  
        {/* Upload Progress Indicator */}
        {uploading && (
          <div className="w-full mt-4">
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                  Upload Progress
                </span>
                <span className="text-xs font-semibold inline-block text-teal-600">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="relative pt-1">
                <div className="flex flex-col">
                  <div className="w-full bg-gray-200 rounded">
                    <div
                      className="bg-teal-500 text-xs leading-none py-1 text-center text-white rounded"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
  
        {/* Submit Button */}
        <div
          onClick={handleSubmit}
          className="mt-10 cursor-pointer w-96 relative inline-flex items-center px-12 py-2 overflow-hidden text-lg font-medium text-black border-2 border-black rounded-full hover:text-white group hover:bg-gray-600"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-black opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="relative">Submit</span>
        </div>
  
        {/* Recent Blogs Section */}
        <div className="flex justify-between items-center mt-40 mb-5 w-screen px-72">
          <h1 className={`${poppins.className} text-3xl font-bold`}>
            Recent Blogs
          </h1>
  
          <div
            onClick={deleteAllBlogs}
            className="bg-red-500 text-white border border-red-600 ml-10 flex justify-center items-center px-5 py-2  transition hover:ease-in hover:bg-red-600 shadow-md rounded-lg  cursor-pointer"
          >
            <h1 className={`${poppins.className} text-md  `}>Delete All Blogs</h1>
          </div>
        </div>
  
        {/* Display Blogs */}
        <div className="flex justify-center items-center space-x-5 my-10">
          <div className="grid grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="w-full flex flex-col items-center text-left"
              >
                <img
                  src={blog.imageUrl || "/default-image.png"} // Use a default image if no image URL is provided
                  alt={blog.title}
                  className="w-[350px] h-[250px] object-cover rounded-lg"
                />
                <h1
                  className={`${poppins.className} text-xl font-bold mt-4 mb-2 w-[350px]`}
                >
                  {blog.title}
                </h1>
                <h2
                  className={`${poppins.className} text-md font-normal text-gray-400 w-[350px] truncate`}
                >
                  {blog.desc.length > 60
                    ? `${blog.desc.substring(0, 60)}...`
                    : blog.desc}
                </h2>
  
                <div className="flex justify-start items-center w-full pt-5 space-x-4 ">
                  <h1
                    onClick={() => openEditModal(blog)}
                    className={`${poppins.className} text-md font-normal py-2 px-4 border border-gray-200 hover:bg-gray-200 rounded-lg cursor-pointer`}
                  >
                    Edit
                  </h1>
                  <h1
                    onClick={() => deleteBlog(blog.id)}
                    className={`${poppins.className} text-md font-normal py-2 px-4 border border-gray-200 hover:bg-gray-200 rounded-lg cursor-pointer`}
                  >
                    Delete
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Modal for Editing Blog */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={saveChanges}
          title={newTitle}
          desc={newDesc}
          setTitle={setNewTitle}
          setDesc={setNewDesc}
        />
      </div>
    );
  }
  
  export default CreateBlogs;
  
