import { io } from '../../../../server';
import { Server } from 'socket.io';
import { SendNewMessageRequest } from "../../../@types/websocket/SendNewMessageRequest";
import { SendUpdatedMessageRequest } from "../../../@types/websocket/SendUpdatedMessageRequest";

export class WebSocketProvider {

    async sendNewMessage(sendNewMessageRequest : SendNewMessageRequest) {
        const { recipient:chatId, content:message, fileURL} = sendNewMessageRequest
        io.to(chatId).emit('newMessage', ({message, fileURL}));
    }

    async sendUpdateMessage(sendUpdatedMessageRequest : SendUpdatedMessageRequest) {
        const { recipient:chatId, messageId, newContent } = sendUpdatedMessageRequest
        io.to(chatId).emit('updateMessage', { messageId, newContent });
    }

    async setupSocket(io: Server) {
        io.on('connection', (socket: any) => {
            console.log('A user connected');

            socket.on('joinRoom', (chatId: string) => {
                socket.join(chatId);
                console.log(`User joined room: ${chatId}`);
            })

            socket.on('sendMessage', (chatId: string, message: string, fileURL:string | null = null) => {
                console.log(`Message received in room: ${chatId}`);
                console.log(`Message: ${message}`);
                io.to(chatId).emit('newMessage', ({message, fileURL}));
            });

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        })
    }
}   