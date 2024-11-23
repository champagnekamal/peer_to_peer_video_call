import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5000';

const userdet:any = localStorage.getItem('user');
const parseuser = JSON.parse(userdet);
export const socket = io(URL,{
    query:parseuser
});