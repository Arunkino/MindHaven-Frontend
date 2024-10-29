import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Heart } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* SVG Animation */}
        <div className="mb-8 relative">
          <svg
            className="w-full h-64 md:h-96 mx-auto"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Floating clouds animation */}
            <g className="animate-float-slow">
              <path
                d="M50 150 C50 120 80 100 110 100 C140 100 170 120 170 150"
                stroke="#E2E8F0"
                strokeWidth="20"
                strokeLinecap="round"
                fill="#F8FAFC"
              />
            </g>
            <g className="animate-float-slower translate-x-4">
              <path
                d="M230 180 C230 150 260 130 290 130 C320 130 350 150 350 180"
                stroke="#E2E8F0"
                strokeWidth="20"
                strokeLinecap="round"
                fill="#F8FAFC"
              />
            </g>
            
            {/* 404 Text */}
            <text
              x="200"
              y="160"
              textAnchor="middle"
              className="text-8xl font-bold"
              fill="#4F46E5"
              filter="url(#shadow)"
            >
              404
            </text>
            
            {/* Floating hearts */}
            <g className="animate-bounce-slow">
              <path
                d="M180 100 L200 120 L220 100 C220 80 180 80 180 100"
                fill="#EC4899"
              />
            </g>
            <g className="animate-bounce-slower translate-x-8">
              <path
                d="M280 130 L300 150 L320 130 C320 110 280 110 280 130"
                fill="#EC4899"
              />
            </g>
            
            {/* Add shadow filter */}
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4">
            Take a Deep Breath
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for seems to have wandered off to find its inner peace. 
            Let's guide you back to a safe space.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors duration-300 min-w-[200px]"
            >
              <Home size={20} />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-full border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-300 min-w-[200px]"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center text-gray-500">
            <Heart className="w-5 h-5 text-pink-500 mr-2 animate-pulse" />
            <p>Remember, every wrong turn is just a new beginning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;