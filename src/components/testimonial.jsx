"use client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ShoppingCartIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import quatImg1 from "../../public/assets/custom-image/quat.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Testimonial = () => {
  var settings = {
    autoplay: false,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  const testimonials = [
    {
      quote: "J'ai suivi plusieurs formations en informatique et en gestion de projet sur ELIMUU. Les cours sont très bien expliqués, accessibles à tout moment et faciles à comprendre. Aujourd'hui, j'ai décroché un meilleur emploi grâce aux compétences acquises. Je recommande cette plateforme à tous ceux qui souhaitent évoluer professionnellement.",
      name: "Grâce Mbuyi",
      location: "Kinshasa",
    },
    {
      quote: "ELIMUU m'a permis d'acquérir de nouvelles compétences en entrepreneuriat et en marketing digital. Les contenus sont pratiques et directement applicables dans mon activité. Aujourd'hui, mon entreprise se développe beaucoup plus rapidement.",
      name: "Sarah Mukendi",
      location: "Goma",
    },
    {
      quote: "Après plusieurs formations suivies sur ELIMUU, j'ai obtenu des certificats qui ont valorisé mon profil professionnel. Lors de mon entretien d'embauche, ces certifications ont été un véritable atout.",
      name: "Esther Kalala",
      location: "Kisangani",
    },
    {
      quote: "Contrairement à d'autres plateformes, ELIMUU propose des formations qui répondent réellement aux besoins du marché de l'emploi. Chaque module apporte des connaissances immédiatement utilisables dans la vie professionnelle.",
      name: "Aline Kasongo",
      location: "Matadi",
    },
  ];

  return (
    <div className="w-full py-2 lg:py-16  testimonial-bg">
      <div className="container mx-auto px-8 py-8 ">
        <div className=" lg:pt-10 pt-0 pb-12">
          <div className=" text-center lg:mx-80">
            <h5 className="text-xs lg:text-sm bg-purple-100 px-5 py-1 inline-block text-[--primary] uppercase rounded-full mb-2">
              Témoignages
            </h5>
            <h4 className='text-gray-700  text-2xl lg:text-4xl font-bold'>Creating A Community Of
              Life Long Learners.</h4>
          </div>
        </div>
        <div className="slider-container">
          <Slider {...settings}>
            {testimonials.map((item, index) => (
              <div key={index} className="mt-5">
                <div className="relative group">
                  <CardHeader className=" items-center absolute -top-12 -left-10  z-50">
                    <div className="p-3 ">
                      <Image
                        src={quatImg1}
                        alt=""
                        className="w-8 h-8 "
                        width={100}
                        height={100}
                      />
                    </div>
                  </CardHeader>
                  <Card className="w-full relative rounded-2xl overflow-hidden  transition-all duration-300 hover:shadow-xl">
                    <CardContent className=" pb-4 px-5">
                      <div className=" mt-6 pb-3 text-gray-600 ">
                        <p className="">
                          {'"' + item.quote + '"'}
                        </p>
                      </div>
                      <h3 className="text-lg font-bold text-primary truncate">
                        {item.name}
                      </h3>
                      <div className="mt-2">
                        <h3 className="text-[--primary]">{item.location}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default Testimonial;
