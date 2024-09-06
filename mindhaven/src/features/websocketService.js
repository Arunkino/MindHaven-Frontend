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

const connectWebSocket = () => {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Max reconnection attempts reached. Please refresh the page.');
    toast.error('Unable to connect. Please refresh the page.');
    return;
  }

  const wsUrl = `wss://api.mindhaven.site/ws/chat/${currentUserId}/`;
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log('WebSocket connected');
    reconnectAttempts = 0;
  };

  socket.onclose = (event) => {
    console.log('WebSocket disconnected');
    console.log('WebSocket closed. Code:', event.code, 'Reason:', event.reason);
    if (!event.wasClean) {
      reconnectAttempts++;
      console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
      setTimeout(connectWebSocket, 50000);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (error instanceof Event) {
      console.error('Error type:', error.type);
    }
    // If error has a message property, log it
    if (error.message) {
      console.error('Error message:', error.message);
    }
    toast.error('Connection error. Trying to reconnect...');
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
    } else if (data.type === 'video_call_event') {
      console.log('Received video call event:', data.data);
  };
};

export const setupWebSocket = (dispatchFunction, userId) => {
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
    dispatch(resetCallState());
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
