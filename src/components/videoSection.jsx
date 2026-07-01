"use client"
import Image from "next/image";
import videoImg1 from "../../public/assets/feature-image/videoImg1.png";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import InfoTitle from "./infoTitle";
import { Button } from "./ui/button";
import VenoBox from 'venobox';
import 'venobox/dist/venobox.min.css';
import { useEffect, useState } from "react";

const VideoSection = () => {
	const [content, setContent] = useState({
		badge: 'Our about us',
		title: '🎉 40% OFF for the First 100 Customers!',
		description: 'Be among the first 100 to grab this exclusive deal and save 40% on your purchase. Don\'t miss out—once the slots are gone, the offer ends! 🚀',
		videoUrl: 'https://youtu.be/6lwh_jfLn2g',
		button1Text: 'Join With Us',
		button1Link: '/about',
		button2Text: 'Our Courses',
		button2Link: '/courselist',
		isActive: true,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const response = await fetch('/api/video-section');
				if (response.ok) {
					const result = await response.json();
					if (result.success && result.data) {
						setContent(result.data);
					}
				}
			} catch (error) {
				console.error('Error fetching video section content:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchContent();
	}, []);

	useEffect(() => {
		if (!loading) {
			new VenoBox({
				selector: ".my-video-links",
			});
		}
	}, [loading]);
	return (
		<div className=" video-img-bg">
			<div className=" w-full h-full bg-[#0E2A46] bg-opacity-[80%] z-10 mb-8  lg:mb-44 ">
				<div className="container mx-auto h-full">
					<div className="lg:grid lg:grid-flow-col lg:grid-cols-2 items-center h-full">
						<div className='relative lg:pl-16 lg:mt-0 lg:pt-0 pt-10'>
							<h5 className=" text-xs lg:text-sm bg-purple-100 px-5 py-1 inline-block text-[--primary] uppercase rounded-full mb-2">
								{content.badge}
							</h5>
							<h4 className='text-white text-xl lg:text-3xl font-bold'>
								{content.title}
							</h4>
							<p className='text-gray-300 lg:text-lg text-sm mt-3 lg:leading-7 md:leading-7'>
								{content.description}
							</p>

							<div className='flex flex-col w-fit lg:flex-row gap-5 lg:mt-10 mt-5'>
								{content.button1Text && content.button1Link && (
									<Link href={content.button1Link}>
										<Button className=' h-8 lg:h-full bg-[--primary] p-0 rounded-full hover:bg-[--primary]  hover:text-white  text-white '>
											<span className=' lg:py-2 pl-5'>{content.button1Text} </span>
											<ArrowRight className=' w-fit lg:w-full h-7 lg:h-full text-sm p-1.5 lg:p-2.5 bg-[#644BFF] rounded-full ml-3' />
										</Button>
									</Link>
								)}
								{content.button2Text && content.button2Link && (
									<Link href={content.button2Link}>
										<Button className='h-8 lg:h-full bg-[--secondary] p-0 rounded-full hover:bg-[--secondary]  hover:text-white  text-white '>
											<span className='py-2 pl-5'>{content.button2Text} </span>
											<ArrowRight className=' w-fit lg:w-full h-7 lg:h-full text-sm p-1.5 lg:p-2.5 bg-[--secondary-foreground] rounded-full ml-3' />
										</Button>
									</Link>
								)}
							</div>

						</div>
						<div className="absolute lg:right-[30%] right-[50%] bottom-[16%] lg:bottom-[44%]">
							<Link className="my-video-links"
								data-autoplay="true"
								data-vbtype="video"
								href={content.videoUrl}>
								<div className=" relative p-2 lg:p-4 bg-gray-300 bg-opacity-20  rounded-full group">
									<div className=" bg-white p-2 lg:p-4  rounded-full group-hover:bg-[--secondary]">
										<Play className="w-5 h-5 fill-[--secondary] text-[--secondary] group-hover:text-white"></Play>
										<div className="absolute bg-gray-300 bg-opacity-20 w-8 h-8 lg:w-10 lg:h-10 rounded-full -bottom-3 right-0"></div>
										<div className="absolute border-[1px] border-gray-300 border-opacity-20 w-6 h-6 lg:w-10 lg:h-10 rounded-full -bottom-7 lg:-bottom-10 right-0"></div>
									</div>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoSection