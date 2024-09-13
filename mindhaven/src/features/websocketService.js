import { toast } from 'react-toastify';
import { addNotification } from './notifications/notificationSlice';
import { addMessage, updateMessageStatus } from './user/chatSlice';
import { 
  setCallActive, 
  setParticipantJoined, 
  updateCallDuration, 
  showCallSummary, 
  resetCallState 
} from './videoCall/videoCallSlice';

let socket = null;
let dispatch = null;
let currentUserId = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds


  // const wsUrl = `ws://127.0.0.1:8000/ws/chat/${currentUserId}/`;


// Helper functions (for intervals)
const getReconnectInterval = () => {
  return Math.min(1000 * (2 ** reconnectAttempts) + Math.random() * 1000, 30000);
};

// Helper functions (for checking online status)
const isOnline = () => {
  return navigator.onLine;
};

  const connectWebSocket = () => {
    if (!navigator.onLine) {
      console.log('No network connection. Delaying reconnection attempt.');
      setTimeout(connectWebSocket, 5000);
      return;
    }
  
    if (!currentUserId) {
      console.log('No user ID available. Skipping WebSocket connection.');
      return;
    }
  
    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
      console.log('WebSocket is already connecting or connected. Skipping connection attempt.');
      return;
    }
  
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached. Please refresh the page.');
      toast.error('Unable to connect. Please refresh the page.');
      return;
    }
    const wsUrl = `wss://api.mindhaven.site/ws/chat/${currentUserId}/`;
    
    socket = new WebSocket(wsUrl);
  
    socket.onopen = () => {
      console.log('WebSocket connected. ReadyState:', socket.readyState);
      reconnectAttempts = 0;
      toast.success('Connected to chat server');
    };
  
    socket.onclose = (event) => {
      console.log('WebSocket disconnected. ReadyState:', socket.readyState);
      console.log('Close event details:', JSON.stringify(event, Object.getOwnPropertyNames(event)));
      if (!event.wasClean && currentUserId) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(connectWebSocket, getReconnectInterval());
      }
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received WebSocket message:', data);

    if (data.type === 'ai_moderation') {
      toast.warning(data.message);
      dispatch(updateMessageStatus({ messageId: data.message_id, status: 'blocked' }));
    } else if (data.type === 'chat_message') {
      dispatch(addMessage(data.message));
    } else if (data.type === 'new_notification') {
      dispatch(addNotification(data.notification));
    } else if (data.type === 'video_call_update') {
      console.log('Received video call update:', data.data);
      handleVideoCallUpdate(data.data);
    }
  };
};

export const setupWebSocket = (dispatchFunction, userId) => {
  if (!userId) {
    console.log('No user ID provided. Skipping WebSocket setup.');
    return null;
  }
  dispatch = dispatchFunction;
  currentUserId = userId;
  connectWebSocket();
  return socket;
};



const handleVideoCallUpdate = (data) => {
  console.log('Handling video call update:', data);
  if (data.user_joined && data.mentor_joined) {
    dispatch(setCallActive(true));
    dispatch(setParticipantJoined(true));
  } else if (data.user_joined || data.mentor_joined) {
    toast.info('Waiting for other participant to join...');
  }

  if (data.call_started) {
    dispatch(setCallActive(true));
    dispatch(setParticipantJoined(true));
    // Start the call duration timer
    setInterval(() => {
      dispatch(updateCallDuration());
    }, 1000);
  }

  if (data.call_ended) {
    console.log('Call ended');
    dispatch(showCallSummary({ duration: data.call_duration }));
    dispatch(setCallActive(false));
    dispatch(setParticipantJoined(false));
  }
};

export const sendMessage = (messageData) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('Sending WebSocket message:', messageData);
    socket.send(JSON.stringify(messageData));
  } else {
    console.error('WebSocket is not open. Unable to send message.');
    toast.error("Unable to send message. Please try again.");
    // Attempt to reconnect
    connectWebSocket();
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
  reconnectAttempts = 0;
};




export const isWebSocketConnected = () => {
  return socket && socket.readyState === WebSocket.OPEN;
};

export const reconnectWebSocket = () => {
  if (!currentUserId) {
    console.log('No user ID available. Skipping reconnection.');
    return;
  }
  if (socket) {
    socket.close();
  }
  reconnectAttempts = 0;
  connectWebSocket();
};





export const disconnectWebSocket = () => {
  console.log('Disconnecting from WebSocket');
  if (socket) {
    socket.close();
    socket = null;
  }
  currentUserId = null;
  reconnectAttempts = 0;
};