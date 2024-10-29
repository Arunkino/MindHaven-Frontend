import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import MindHavenLanding from '../components/LandingHero';
import Lottie from "lottie-react";
import animationData from '../assets/Animation1.json';
import download_img from '../assets/download_app.svg';
import image1 from '../assets/final_vector_mental_health.svg';
import image2 from '../assets/mental_health_01_blue.svg';
import image3 from '../assets/Mental_health_03_720X720.svg';

const images = [
  { src: image1, alt: 'Image 1', caption: 'Finding inner peace is just a step away \nJoin us today' },
  { src: image2, alt: 'Image 2', caption: 'Your mental well-being matters \nLet\'s walk this path together' },
  { src: image3, alt: 'Image 3', caption: 'Unlock Your Potential \n We are Here for You' },
];



const Home = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16"> {/* Added pt-16 for fixed header */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-custom-text">
                Find Peace Within with MindHaven
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600">
                Your go-to platform for mental health support and connections.
              </p>
              <img 
                src={download_img} 
                alt="Download app" 
                className="max-w-[200px] md:max-w-[250px] mx-auto lg:mx-0"
              />
            </div>

            {/* Right Column - Animation */}
            <div className="order-1 lg:order-2">
              <Lottie 
                animationData={animationData} 
                loop={true} 
                className="w-full max-w-[500px] mx-auto"
              />
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ImageCarousel images={images} />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <MindHavenLanding />
      </main>
    </div>
  );
};

export default Home;