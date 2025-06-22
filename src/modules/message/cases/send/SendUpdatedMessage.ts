import { IWebSocketProvider } from '../../../../infra/providers/websocket/IWebSocketProvider';
import { UpdateMessageRequest } from '../../../../@types/message/UpdateMessageRequest';

export class SendUpdatedMessage {
    constructor(
        private readonly webSocketProvider: IWebSocketProvider,
    ) {}

    async send(updateMessage: UpdateMessageRequest): Promise<void> {
        this.webSocketProvider.sendUpdateMessage(updateMessage);
    }
}