import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { Message } from "../../../message/domain/entities/Message";
import { UpdateMessageRequest } from '../../../../@types/message/UpdateMessageRequest';


export interface IMessageRepository {
    save(message: CreateMessageRequest): Promise<Message>;
    update(updateMessageRequest : UpdateMessageRequest): Promise<Message>;
    delete(messageId: string): Promise<Message>;
    listMessagesByChatId(chatId: string): Promise<Message[]>;
    findById(id: string): Promise<Message | null>;
}
