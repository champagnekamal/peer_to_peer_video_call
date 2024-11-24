import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://peertopeervideocallserver-production.up.railway.app';

const userdet:any = localStorage.getItem('user');
const parseuser = JSON.parse(userdet);
export const socket = io(URL,{
    query:parseuser
});