import { IMessageRepository } from '../domain/repositories/IMessageRepository';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IChatRepository } from '../../chat/domain/repositories/IChatRepository';
import { IStorageProvider } from '../../../infra/providers/storage/IStorageProvider';
import { IWebSocketProvider } from '../../../infra/providers/websocket/IWebSocketProvider';
import { IEmailProvider } from '../../../infra/providers/email/IEmailProvider';
import { CreateMessageRequest } from '../../../@types/message/CreateMessageRequest';
import { Message } from '../domain/entities/Message';
import { SendMessage } from './send/SendMessage';

export class CreateMessage {
    constructor(
        private messageRepository: IMessageRepository,
        private userRepository: IUserRepository,
        private chatRepository: IChatRepository,
        private storageProvider: IStorageProvider,
        private webSocketProvider: IWebSocketProvider,
        private emailProvider: IEmailProvider
    ) {}

    async create(request: CreateMessageRequest): Promise<Message> {
        const { sender, recipient, content, file, sentAt } = request;

        const user = await this.userRepository.findById(sender);
        if (!user) {
            throw new Error('User not found');
        }

        const chat = await this.chatRepository.findById(recipient);
        if (!chat) {
            throw new Error('Chat not found');
        }

        let folder = '';
        let fileURL: string | undefined;

        if (file) {
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
        
            if (file) {
                fileURL = await this.storageProvider.uploadFile({
                    fileBuffer: file.buffer,
                    fileName: file.originalname,
                    mimeType: file.mimetype,
                    folder: folder
                });
            }
        }

        const data : CreateMessageRequest = {
            sender,
            recipient,
            content,
            fileURL,
            sentAt
        }

        new SendMessage(this.webSocketProvider, this.storageProvider, this.chatRepository, this.userRepository, this.emailProvider).send(data);

        const result = await this.messageRepository.save(data);
        
        return result;
    }
}