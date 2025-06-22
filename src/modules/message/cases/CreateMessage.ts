import { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IChatRepository } from '../../chat/domain/repositories/IChatRepository';
import { IStorageProvider } from '../../../infra/providers/storage/IStorageProvider';
import { IWebSocketProvider } from '../../../infra/providers/websocket/IWebSocketProvider';
import { CreateMessageRequest } from '../../../@types/message/CreateMessageRequest';
import { Message } from '../domain/entities/Message';
import { SendMessage } from './send/SendMessage';

export class CreateMessage {
    constructor(
        private messageRepository: IMessageRepository,
        private userRepository: IUserRepository,
        private chatRepository: IChatRepository,
        private storageProvider: IStorageProvider,
        private webSocketProvider: IWebSocketProvider
    ) {}

    async create(request: CreateMessageRequest): Promise<Message> {
        const { sender, recipient, content, file } = request;

        const user = await this.userRepository.findById(sender);
        if (!user) {
            throw new Error('User not found');
        }

        const chat = await this.chatRepository.findById(recipient);
        if (!chat) {
            throw new Error('Chat not found');
        }

        let folder = '';

        if(file?.mimetype.startsWith('image/')) {
            folder = 'message/photos';
        }
        else if (file?.mimetype.startsWith('video/')) {
            folder = 'message/videos';
        }
        else if (file?.mimetype.startsWith('audio/')) {
            folder = 'message/audios';
        }
        else{
            throw new Error('Unsupported file type');
        }

        let fileURL: string | undefined;
        if (file) {
            fileURL = await this.storageProvider.uploadFile({
                fileBuffer: file.buffer,
                fileName: file.originalname,
                mimeType: file.mimetype,
                folder: folder
            });
        }
        
        new SendMessage(this.webSocketProvider, this.storageProvider, this.chatRepository).send(recipient, content, fileURL);

        const message = await this.messageRepository.save({
            sender,
            recipient,
            content,
            fileURL
        });

        
        return message;
    }
}