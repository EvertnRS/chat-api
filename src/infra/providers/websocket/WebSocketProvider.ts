import { io } from '../../../../server';
import { Server } from 'socket.io';

export class WebSocketProvider {

    async sendNewMessage(chatId: string, message: string, fileURL:string | null = null) {
        io.to(chatId).emit('newMessage', ({message, fileURL}));
    }

    async setupSocket(io: Server) {
        io.on('connection', (socket: any) => {
            console.log('A user connected');

            socket.on('joinRoom', (chatId: string) => {
                socket.join(chatId);
                console.log(`User joined room: ${chatId}`);
            })

            socket.on('sendMessage', (chatId: string, message: string, fileURL:string | null = null) => {
                console.log(`Message received in room ${chatId}`);
                console.log(`Message 2 ${message}`);
                io.to(chatId).emit('newMessage', ({message, fileURL}));
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        })
    }
}   