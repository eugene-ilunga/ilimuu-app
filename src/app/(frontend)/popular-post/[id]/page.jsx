"use client";
import Image from 'next/image';
import React, {useEffect, useState } from 'react';
import {useRouter, useSearchParams } from 'next/navigation';

const PostPage = () => {

const router = useRouter(); 
const [post, setPost] = useState([]);
const [postDetails, setPostDetails] = useState([]);
const searchParams = useSearchParams();
const postID = searchParams.get("id");

useEffect(() => {
  if(!postID){
     console.log("Post ID is not available")
      return;
  }

  const getPostDetails = async () => {
    const formData = new FormData();
    formData.append("id", postID);
    try {
      const response = await fetch("/api/post-feed/details", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setPostDetails(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  getPostDetails();
},[postID]);

useEffect(() => {
  const getPosts = async () => {
    try {
      const formData = new FormData();
      formData.set('page', 1)
      formData.set('pagination', 7)
      const res = await fetch("/api/post-feed/list",{
        method: "POST",
        body: formData
      });
      const postData = await res.json();
      console.log(postData.data);
      setPost(postData.data);
    } catch (error){
      console.error("Error fetching data: ", error);
    }
  };
  getPosts();
},[]);

  return (
    <div className='container lg:mx-auto p-2 lg:flex block px-6'>
      <div className='lg:w-2.5/4 w-full lg:pr-6 lg:p-2 p-1'>
        <div className='py-2'>
          <div className='flex items-center space-x-5 mb-5'>
            <Image className='rounded-full w-10 h-10 lg:w-12 lg:h-12 border border-red-600' alt='artical' src={postDetails?.user?.image} width={100} height={100}></Image>
            <p className='text-sm flex'> <span className='text-slate-500'>By</span><span className='px-1'>{postDetails?.user?.name}</span><span className='text-slate-500'> {new Date(postDetails?.createdAt).toLocaleDateString()}</span></p>
          </div>
        </div>
        <div>
          {postDetails?.video ? (
            <video
              src={postDetails.video}
              controls
              className='w-full lg:h-[400px] md:h-[350px] h-[200px] rounded-md object-contain bg-gray-50'
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image src={postDetails?.image?.[0]} alt={''} width={800} height={800} className='w-full lg:h-[400px] md:h-[350px] h-[200px] rounded-md'></Image>
          )}
        </div>
        <div className='text-sm lg:text-lg lg:pt-10 pt-5'>
          <p>{postDetails?.content}</p>
        </div>
      </div>
      <div className='lg:w-1.5/4 w-full lg:p-2'>
        <div className='text-lg p-2 font-bold'>Popular Articals</div>
        {
          post?.map((post) => (
            <div
            key={post._id}
            onClick={() => router.push(`/popular-post/page?id=${post._id}`)} // Navigate programmatically
            className='flex items-center space-x-3 py-2 cursor-pointer'
          >
            <div className='flex items-center space-x-3 py-2'>
              <Image
                src={post?.image?.[0]}
                alt={''}
                width={200}
                height={150}
                className='w-[150px] h-[100px] rounded-md'
              />
              <div className='text-sm'>
                <p className='font-bold'>{post?.content?.slice(0, 50) || "Post"}</p>
                <p className='text-slate-500'>{new Date(post?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          ))
        }
      </div>

    </div>
  )
}

export default PostPage;



// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation'; // Use useRouter from next/navigation

// const PostPage = () => {
//   const router = useRouter(); // Correct useRouter for the app directory
//   const [post, setPost] = useState([]);
//   const [postDetails, setPostDetails] = useState([]);
//   const searchParams = useSearchParams();
//   const postID = searchParams.get("id");

//   useEffect(() => {
//     if (!postID) {
//       console.log("Post ID is not available");
//       return;
//     }

//     const getPostDetails = async () => {
//       const formData = new FormData();
//       formData.append("id", postID);
//       try {
//         const response = await fetch("/api/post-feed/details", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await response.json();
//         console.log(data);
//         setPostDetails(data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getPostDetails();
//   }, [postID]);

//   useEffect(() => {
//     const getPosts = async () => {
//       try {
//         const formData = new FormData();
//         formData.set('page', 1);
//         formData.set('pagination', 7);
//         const res = await fetch("/api/post-feed/list", {
//           method: "POST",
//           body: formData,
//         });
//         const postData = await res.json();
//         console.log(postData.data);
//         setPost(postData.data);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };
//     getPosts();
//   }, []);

//   return (
//     <div className='container lg:mx-auto p-2 lg:flex block px-6'>
//       <div className='lg:w-2.5/4 w-full lg:pr-6 lg:p-2 p-1'>
//         <div className='py-2'>
//           <div className='text-xl lg:text-4xl font-bold pb-8'>{postDetails?.title}</div>
//           <div className='flex items-center space-x-5 mb-5'>
//             <Image
//               className='rounded-full w-10 h-10 lg:w-12 lg:h-12 border border-red-600'
//               alt='artical'
//               src={postDetails?.user?.image}
//               width={100}
//               height={100}
//             ></Image>
//             <p className='text-sm flex'>
//               <span className='text-slate-500'>By</span>
//               <span className='px-1'>{postDetails?.user?.name}</span>
//               <span className='text-slate-500'> {new Date(postDetails?.createdAt).toLocaleDateString()}</span>
//             </p>
//           </div>
//         </div>
//         <div>
//           <Image
//             src={postDetails?.image?.[0]}
//             alt={''}
//             width={800}
//             height={800}
//             className='w-full lg:h-[400px] md:h-[350px] h-[200px] rounded-md'
//           ></Image>
//         </div>
//         <div className='text-sm lg:text-lg lg:pt-10 pt-5'>
//           <p>{postDetails?.content}</p>
//         </div>
//       </div>
//       <div className='lg:w-1.5/4 w-full lg:p-2'>
//         <div className='text-lg p-2 font-bold'>Popular Articles</div>
//         {post?.map((post) => (
//           <div
//             key={post._id}
//             onClick={() => router.push(`/popular-post/page?id=${post._id}`)} // Use router.push here
//             className='flex items-center space-x-3 py-2 cursor-pointer'
//           >
//             <div className='flex items-center space-x-3 py-2'>
//               <Image
//                 src={post?.image?.[0]}
//                 alt={''}
//                 width={200}
//                 height={150}
//                 className='w-[150px] h-[100px] rounded-md'
//               />
//               <div className='text-sm'>
//                 <p className='font-bold'>{post?.title}</p>
//                 <p className='text-slate-500'>{new Date(post?.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PostPage;