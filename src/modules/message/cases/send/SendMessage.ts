import { IWebSocketProvider } from '../../../../infra/providers/websocket/IWebSocketProvider';
import { IStorageProvider } from '../../../../infra/providers/storage/IStorageProvider';
import { IEmailProvider } from '../../../../infra/providers/email/IEmailProvider';
import { IChatRepository } from '../../../chat/domain/repositories/IChatRepository';
import { CreateMessageRequest } from '../../../../@types/message/CreateMessageRequest';
import { IUserRepository } from '../../../user/domain/repositories/IUserRepository';

export class SendMessage {
    constructor(
        private readonly webSocketProvider: IWebSocketProvider,
        private readonly storageProvider: IStorageProvider,
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository,
        private readonly emailProvider: IEmailProvider
    ) {}

    async send(message: CreateMessageRequest) {
        const { recipient, fileURL, sentAt } = message;
        
        let file: string | undefined = undefined;
        if (fileURL) {
            file = await this.storageProvider.getFile(fileURL);
        }

        const participantsIds = await this.chatRepository.listParticipantsByChatId(recipient);

        const participants = await this.userRepository.findManyById(participantsIds);

        const connectedUsers = [];

        for (const participant of participants) {
            const isConnected = await this.webSocketProvider.isUserConnected(participant.id);
            console.log(`User ${participant.id} is connected: ${isConnected}`);
            if (isConnected) {
                connectedUsers.push(participant);
            } else {
                const chat = await this.chatRepository.findById(recipient);
                await this.emailProvider.sendEmail(
                    participant.email,
                    'New Message Notification',
                    `You have a new message in chat ${chat?.name}.`
                );
            }
        }
        
        
        await this.chatRepository.updateLastMessageTime(recipient, sentAt);

        this.webSocketProvider.sendNewMessage(message);

    }
}