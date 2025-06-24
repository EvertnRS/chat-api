import { Server } from 'socket.io';
import { CreateMessageRequest } from '../../../@types/message/CreateMessageRequest';
import { UpdateMessageRequest } from '../../../@types/message/UpdateMessageRequest';
import { ChatRepository } from '../../../modules/chat/domain/repositories/ChatRepository';
import { JWTProvider } from '../auth/JWTProvider';

export class WebSocketProvider {
    private static instance: WebSocketProvider;
    private connectedUsers: Map<string, string>;
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.connectedUsers = new Map<string, string>();
        }

    public static getInstance(): WebSocketProvider {
        return WebSocketProvider.instance;
    }

    public static startInstance(io: Server): WebSocketProvider {
        if (!WebSocketProvider.instance) {
            WebSocketProvider.instance = new WebSocketProvider(io);
        }
        return WebSocketProvider.instance;
    }

    async sendNewMessage(sendNewMessageRequest: CreateMessageRequest) {
        const { recipient: chatId } = sendNewMessageRequest
        this.io.to(chatId).emit('newMessage', sendNewMessageRequest);
    }

    async sendUpdateMessage(sendUpdatedMessageRequest: UpdateMessageRequest) {
        const { recipient: chatId } = sendUpdatedMessageRequest
        this.io.to(chatId).emit('updateMessage', sendUpdatedMessageRequest);
    }

    async setupSocket(io: Server) {
        this.io = io;
        io.use((socket, next) => {
            const token = socket.handshake.headers.authentication as string | undefined;

            if (!token) {
                return next(new Error('Authentication error: Token not provided'));
            }

            try {
                const jwtProvider = new JWTProvider();
                const decoded = jwtProvider.verify(token) as { id: string };
                socket.data.userId = decoded.id;
                next();
            } catch (error) {
                return next(new Error('Authentication error: Invalid token'));
            }
        });

        io.on('connection', (socket) => {
            const userId = socket.data.userId;
            console.log(`User connected: ${userId}`);

            socket.on('joinRoom', async (chatId: string) => {
                const chatRepository = new ChatRepository();
                const participant = await chatRepository.isUserInChat(chatId, userId);

                if (!participant) {
                    throw new Error(`User ${userId} is not a participant in chat ${chatId}`);
                    return;
                }
                
                socket.join(chatId);
                this.connectedUsers.set(userId, socket.id);
                console.log(`User ${userId} joined room ${chatId}`);
            });

            socket.on('sendMessage', (chatId: string, message: string, fileURL: string | null = null) => {
                io.to(chatId).emit('newMessage', { message, fileURL });
            });

            socket.on('disconnect', () => {
                this.connectedUsers.delete(userId);
                console.log(`User ${userId} disconnected`);
            });
        });
    }

    async isUserConnected(userId: string): Promise<boolean> {
        console.log(this.connectedUsers)
        return this.connectedUsers.has(userId);
    }
}   