import { IWebSocketProvider } from '../../../infra/providers/websocket/IWebSocketProvider';
import { IStorageProvider } from '../../../infra/providers/storage/IStorageProvider';

export class SendMessage {
    constructor(
        private readonly webSocketProvider: IWebSocketProvider,
        private readonly s3StorageProvider: IStorageProvider
    ) {}

    async send(recipient: string, content: string, fileURL?: string) {
        let file: string | undefined = undefined;
        if (fileURL) {
            file = await this.s3StorageProvider.getFile(fileURL);
        }
        
        this.webSocketProvider.sendNewMessage(recipient, content, file);
    }
}