import { CreateMessageRequest } from "../../../@types/message/CreateMessageRequest";
import { UpdateMessageRequest } from "../../../@types/message/UpdateMessageRequest";

export interface IWebSocketProvider {
    sendNewMessage(sendNewMessageRequest : CreateMessageRequest): Promise<void>;
    sendUpdateMessage(sendUpdatedMessageRequest : UpdateMessageRequest): Promise<void>;
    isUserConnected(userId: string): Promise<boolean>;
}