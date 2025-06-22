import { SendNewMessageRequest } from "../../../@types/websocket/SendNewMessageRequest";
import { SendUpdatedMessageRequest } from "../../../@types/websocket/sendUpdatedMessageRequest";

export interface IWebSocketProvider {
    sendNewMessage(sendNewMessageRequest : SendNewMessageRequest): Promise<void>;
    sendUpdateMessage(sendUpdatedMessageRequest : SendUpdatedMessageRequest): Promise<void>;
}