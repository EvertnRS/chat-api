import { IWebSocketProvider } from '../../../../infra/providers/websocket/IWebSocketProvider';

export class SendUpdatedMessage {
    constructor(
        private readonly webSocketProvider: IWebSocketProvider,
    ) {}

    async send(chatId: string, messageId: string, newContent: string): Promise<void> {
        this.webSocketProvider.sendUpdateMessage({ recipient:chatId, messageId, newContent });
    }
}