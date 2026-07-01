'use client'
import Link from "next/link";
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const PopularPost = () => {

    const [post, setPost] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const formData = new FormData();
                formData.set('page', 1)
                formData.set('pagination', 4)
                const res = await fetch("api/post-feed/list", {
                    method: "POST",
                    body: formData

                })
                const postData = await res.json();
                console.log(postData.data);
                setPost(postData.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getPosts();
    }, []);



    return (

        <div >

            <h4 className='container text-2xl font-bold pt-5 px-5'>All Blogs</h4>
            <div className='container flex flex-wrap gap-6 px-4 py-10'>

                {post.map((posts) => {

                    return (
                        <div key={posts._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col relative">

                            <Image src={posts.image[0]} alt='blog image' className="rounded-t-lg w-[450px] h-[250px] object-cover" height={250} width={400}></Image>

                            <div className="p-5 flex flex-col flex-grow">

                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {posts.title}
                                </h5>


                                <h4 className="mb-3 h-130 font-normal text-gray-700 dark:text-gray-400 flex flex-grow">
                                    {posts.content?.length > 50 ? posts.content.slice(0, 200) + "..." : posts.content}
                                </h4>
                                <div className="">
                                    <Link href={`/popular-post/page?id=${posts._id}`}>

                                        <h5 className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >
                                            Read more
                                            <svg
                                                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 14 10"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M1 5h12m0 0L9 1m4 4L9 9"
                                                />
                                            </svg>
                                        </h5>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )


                })}

            </div>
        </div>





    )
}

export default PopularPost
