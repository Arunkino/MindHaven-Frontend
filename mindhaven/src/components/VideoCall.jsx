import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setCallActive, 
  updateCallDuration, 
  setParticipantJoined, 
  showCallSummary, 
  resetCallState 
} from '../features/videoCall/videoCallSlice';
import AgoraUIKit from 'agora-react-uikit';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import { setupWebSocket, closeWebSocket, sendMessage } from '../features/websocketService';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { Phone, Clock, UserPlus, AlertTriangle, HandCoins, House, Redo } from 'lucide-react';

const VideoCall = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { callId } = useParams();
  const { 
    isCallActive, 
    callDuration, 
    participantJoined, 
    showCallSummary: showSummary, 
    finalCallDuration 
  } = useSelector((state) => state.videoCall);
  const {currentUser} = useSelector((state) => state.user);
  const [token, setToken] = useState(null);
  const [showEndCallConfirmation, setShowEndCallConfirmation] = useState(false);

  const [paymentData, setPaymentData] = useState(null);


  // for payment sdk loading 
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        return;
      }
      const response = await axiosInstance.post(`/api/create-payment/${callId}/`);
      console.log("PAYMENT DATA::", response.data);
      setPaymentData(response.data);
      
      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID, 
        amount: response.data.amount,
        currency: response.data.currency,
        name: "MindHaven",
        description: "Payment for video consultation",
        order_id: response.data.razorpay_order_id,
        handler: function (razorpayResponse) {
          verifyPayment(razorpayResponse, response.data.payment_id);
        },
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };
  
  const verifyPayment = async (razorpayResponse, paymentId) => {
    console.log("Razorpay Response:", razorpayResponse);
    try {
      const response = await axiosInstance.post('/api/verify-payment/', {
        payment_id: paymentId,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      });
      
      if (response.data.status === 'Payment successful') {
        toast.success('Payment successful!');
        // Handle successful payment (e.g., update UI, redirect)
        setTimeout(() => {
          goToDashboard();
        }, 2000);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment. Please contact support.');
    }
  };


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get(`/api/appointments/${callId}/token/`);
        setToken(response.data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
        toast.error("Failed to fetch token. Please try again.");
      }
    };
    fetchToken();

    const socket = setupWebSocket(dispatch, currentUser.id);
    
    setTimeout(() => {
      sendMessage({
        type: 'video_call_event',
        data: {
          event_type: 'user_joined',
          appointment_id: callId,
          user_role: currentUser.role,
        },
      });
    }, 3000);

    return () => {
      closeWebSocket();
    };
  }, [callId, currentUser]);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        dispatch(updateCallDuration());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, dispatch]);


  useEffect(() => {
    if (showSummary) {
      // Stop the AgoraUIKit or perform any necessary cleanup
      // You might need to call a function from AgoraUIKit to properly end the call
      // For example: AgoraUIKit.leave() (check the AgoraUIKit documentation for the correct method)
      
      // Show the call summary modal
      setShowEndCallConfirmation(false);
    }
  }, [showSummary]);

  // useEffect(() => {
  //   const handleCallEnd = (action) => {
  //     if (action.type === 'SHOW_CALL_SUMMARY') {
  //       console.log('Showing call summary:', action.payload);
  //       setFinalCallDuration(action.payload.duration);
  //       setShowCallSummary(true);
  //     }
  //   };

  //   dispatch(handleCallEnd);

  //   return () => {
  //     // Clean up the dispatch subscription
  //     dispatch({ type: 'REMOVE_CALL_END_HANDLER' });
  //   };
  // }, [dispatch]);

  const handleCallEnd = useCallback(() => {
    setShowEndCallConfirmation(true);
  }, []);

  const confirmEndCall = useCallback(() => {
    sendMessage({
      type: 'video_call_event',
      data: {
        event_type: 'call_ended',
        appointment_id: callId,
        call_duration: callDuration,
        user_role: currentUser.role,
      },
    });
    setShowEndCallConfirmation(false);
    dispatch(showCallSummary({ duration: callDuration }));
  }, [callId, callDuration, currentUser.role, dispatch]);

  const goToDashboard = useCallback(() => {
    dispatch(resetCallState());
    const redirectPath = currentUser.role === 'mentor' ? '/mentor/dashboard' : '/dashboard';
    navigate(redirectPath);
    window.location.reload();
  }, [dispatch, navigate, currentUser.role]);



  const proceedToPayment = useCallback(() => {
    console.log("Proceeding to payment...");
    initiatePayment();
  }, [goToDashboard]);

  const callbacks = {
    EndCall: handleCallEnd,
  };

  const rtcProps = {
    appId: import.meta.env.VITE_AGORA_APP_ID,
    channel: callId,
    token: token,
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-900">
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
      {isCallActive && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-semibold">{formatDuration(callDuration)}</span>
          </div>
          <button 
            onClick={handleCallEnd}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>End Call</span>
          </button>
        </div>
      )}
      {!participantJoined && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-black p-4 text-center flex items-center justify-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Waiting for other participant to join...</span>
        </div>
      )}
      <Modal isOpen={showEndCallConfirmation} onClose={() => setShowEndCallConfirmation(false)}>
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">End Call Confirmation</h2>
          <p className="mb-6 text-gray-600">Are you sure you want to end the call?</p>
          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setShowEndCallConfirmation(false)}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button 
              onClick={confirmEndCall}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              End Call
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showSummary} onClose={() => {}}>
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Call Summary</h2>
          <p className="mb-4 text-gray-600">Your session has ended.</p>
          <div className="flex items-center space-x-2 mb-6">
            <Clock className="w-5 h-5 text-blue-500" />
            <p className="text-lg font-semibold text-gray-700">
              Call Duration: {formatDuration(finalCallDuration)}
            </p>
          </div>
          {currentUser.role === 'mentor' ? (
            <button 
              onClick={goToDashboard}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <Redo size={15}/>
              <House className="w-5 h-5" size={18}/>
            </button>
          ) : (
            <button 
              onClick={proceedToPayment}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
            >
              <span>Proceed to Payment</span>
              <HandCoins className="w-5 h-5" size={30}/>
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VideoCall;
