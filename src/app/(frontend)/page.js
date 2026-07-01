import Image from "next/image";

import HeroSection from "../../components/heroSection";
import Category from "../../components/category";
import Mentor from "../../components/mentor";
import Course from "../../components/course";
import Commenter from "../../components/commenter";
import Stats from "../../components/stats";
import UpcommingCourse from "../../components/upcommingCourse";
import Trending from "../../components/trending";
import JoinUs from "../../components/joinUs";
import StoreProduct from "../../components/storeProduct";
import Subscribe from "../../components/subscribe";
import VideoSection from "@/components/videoSection";
import Blog from "@/components/blog";
import GrowSkills from "@/components/growskills";
import PopularCourse from "@/components/popularCourse";
import BestSellingCourse from "@/components/bestSellingCourse";
import NewCategory from "@/components/newCategory";
import BestRatedCourse from "@/components/bestRatedCourse";
import ChooseUs from "@/components/chooseUs";
import PopularSliderCourse from "@/components/popularSliderCourse";
import Instructor from "@/components/instructor";
import FreeCourse from "@/components/freeCourse";
import Testimonial from "@/components/testimonial";
import StatesCounter from "@/components/statesCounter";
import JoinNewsLetter from "@/components/joinNewsLetter";
import MostPopularPost from "@/components/mostPopularPost";
import AdmissionMessage from "@/components/admissionMessage";
import FeaturedBootcamp from "@/components/featuredBootcamp";
import ChatbotWrapper from "@/components/chatbotWrapper";

export default function Home() {
  return (
    <section className="w-full  flex-center flex-col">
      <HeroSection />
      <GrowSkills></GrowSkills>
      <BestSellingCourse></BestSellingCourse>
      <VideoSection></VideoSection>
      <PopularCourse></PopularCourse>
      <NewCategory></NewCategory>
      <FeaturedBootcamp></FeaturedBootcamp>

      <BestRatedCourse></BestRatedCourse>
      <ChooseUs></ChooseUs>
      <PopularSliderCourse></PopularSliderCourse>
      <JoinUs></JoinUs>
      <Instructor></Instructor>
      <FreeCourse></FreeCourse>
      <StatesCounter></StatesCounter>
      <Testimonial></Testimonial>
      <AdmissionMessage></AdmissionMessage>
      <JoinNewsLetter></JoinNewsLetter>
      <MostPopularPost></MostPopularPost>
      
      {/* Chatbot - Only shows if enabled in settings */}
      <ChatbotWrapper />
    </section>
  );
}
