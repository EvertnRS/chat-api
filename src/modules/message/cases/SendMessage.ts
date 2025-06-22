import { IWebSocketProvider } from '../../../infra/providers/websocket/IWebSocketProvider';
import { IStorageProvider } from '../../../infra/providers/storage/IStorageProvider';
import { IChatRepository } from '../../chat/domain/repositories/IChatRepository';

export class SendMessage {
    constructor(
        private readonly webSocketProvider: IWebSocketProvider,
        private readonly storageProvider: IStorageProvider,
        private readonly chatRepository: IChatRepository,
    ) {}

    async send(recipient: string, content: string, fileURL?: string) {
        let file: string | undefined = undefined;
        if (fileURL) {
            file = await this.storageProvider.getFile(fileURL);
        }
        
        this.webSocketProvider.sendNewMessage(recipient, content, file);

        this.chatRepository.updateLastMessageTime(recipient, new Date());
    }
}