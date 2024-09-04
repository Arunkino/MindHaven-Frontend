import React, { useState, useEffect } from 'react';
import { Download, ZoomIn, ZoomOut, X } from 'lucide-react';

const FullScreenImage = ({ src, alt, onClose, isOpen }) => {
  const [scale, setScale] = useState(1);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.1, 3));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.5));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = 'certificate.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isRendered && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'animate-fadeIn' : 'animate-fadeOut'
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full h-full flex items-center justify-center ${
          isOpen ? 'animate-zoomIn' : 'animate-zoomOut'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="absolute top-4 right-4 flex space-x-2 opacity-75 hover:opacity-100 transition-opacity">
          <button
            onClick={zoomIn}
            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Zoom In"
          >
            <ZoomIn size={24} />
          </button>
          <button
            onClick={zoomOut}
            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Zoom Out"
          >
            <ZoomOut size={24} />
          </button>
          <button
            onClick={handleDownload}
            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Download"
          >
            <Download size={24} />
          </button>
          <button
            onClick={onClose}
            className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenImage;