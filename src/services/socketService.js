import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

let socket;

export const initSocket = (token) => {
  socket = io(URL, {
    auth: {
      token
    }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
