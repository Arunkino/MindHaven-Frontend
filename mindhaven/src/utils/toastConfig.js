
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast configurations
export const toastConfig = {
  position: "top-center", // Better for mobile
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true, // Enable drag to dismiss
  draggablePercent: 35, // Shorter drag distance
  swipe: true, // Enable swipe
  swipeable: true,
  progress: undefined,
  theme: "colored",
  style: {
    fontSize: '14px',
    maxWidth: '400px',
    fontWeight: '500'
  }
};

// Custom styled toast functions
export const successToast = (message) => 
  toast.success(message, {
    ...toastConfig,
    className: 'bg-green-50 border-l-4 border-green-500',
    bodyClassName: 'text-green-800',
    progressClassName: 'bg-green-500',
  });

export const errorToast = (message) => 
  toast.error(message, {
    ...toastConfig,
    className: 'bg-red-50 border-l-4 border-red-500',
    bodyClassName: 'text-red-800',
    progressClassName: 'bg-red-500',
  });

export const infoToast = (message) => 
  toast.info(message, {
    ...toastConfig,
    className: 'bg-blue-50 border-l-4 border-blue-500',
    bodyClassName: 'text-blue-800',
    progressClassName: 'bg-blue-500',
  });

export const warningToast = (message) => 
  toast.warning(message, {
    ...toastConfig,
    className: 'bg-yellow-50 border-l-4 border-yellow-500',
    bodyClassName: 'text-yellow-800',
    progressClassName: 'bg-yellow-500',
  });