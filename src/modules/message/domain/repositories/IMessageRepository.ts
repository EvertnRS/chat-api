import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { UpdateMessageRequest } from '../../../../@types/message/UpdateMessageRequest';
import { ListMessageRequest } from '../../../../@types/message/ListMessageRequest';
import { Message } from "../../../message/domain/entities/Message";
import type { MessageResponse } from "../../../../@types/message/MessageResponse";


export interface IMessageRepository {
    save(message: CreateMessageRequest): Promise<MessageResponse>;
    update(updateMessageRequest : UpdateMessageRequest): Promise<MessageResponse>;
    delete(messageId: string): Promise<void>;
    listMessagesByChatId(listMessagesRequest: ListMessageRequest): Promise<MessageResponse[]>;
    findById(id: string): Promise<Message | null>;
}
