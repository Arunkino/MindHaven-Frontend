import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import MindHavenLanding from '../components/LandingHero';
import Lottie from "lottie-react";
import animationData from '../assets/Animation1.json';
import image1 from '../assets/final_vector_mental_health.svg';
import image2 from '../assets/mental_health_01_blue.svg';
import image3 from '../assets/Mental_health_03_720X720.svg';
import download_img from '../assets/download_app.svg'

const images = [
  { src: image1, alt: 'Image 1', caption: 'Finding inner peace is just a step away \nJoin us today' },
  { src: image2, alt: 'Image 2', caption: 'Your mental well-being matters \nLet\'s walk this path together' },
  { src: image3, alt: 'Image 3', caption: 'Unlock Your Potential \n We are Here for You' },
];



const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center py-12 px-4">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 order-2 lg:order-1">
            <Lottie animationData={animationData} loop={true} className="w-full h-auto" />
          </div>
          
          {/* Content */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 text-center lg:text-left order-1 lg:order-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-custom-text">Find Peace Within with MindHaven</h1>
            <p className="mb-4 text-sm sm:text-base">Your go-to platform for mental health support and connections.</p>
            <img src={download_img} alt="Download_app_image" className="mx-auto lg:mx-0 max-w-full h-auto" />
          </div>
          
          {/* Image Carousel */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 order-3">
            <ImageCarousel images={images} />
          </div>
        </div>
      </main>
      <MindHavenLanding />
    </div>
  );
};

export default Home;