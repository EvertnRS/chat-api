import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { UpdateMessageRequest } from '../../../../@types/message/UpdateMessageRequest';
import { ListMessageRequest } from '../../../../@types/message/ListMessageRequest';
import { Message } from "../../../message/domain/entities/Message";


export interface IMessageRepository {
    save(message: CreateMessageRequest): Promise<Message>;
    update(updateMessageRequest : UpdateMessageRequest): Promise<Message>;
    delete(messageId: string): Promise<void>;
    listMessagesByChatId(listMessagesRequest: ListMessageRequest): Promise<Message[]>;
    findById(id: string): Promise<Message | null>;
}
