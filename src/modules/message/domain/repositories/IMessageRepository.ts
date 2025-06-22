import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { Message } from "../../../message/domain/entities/Message";


export interface IMessageRepository {
    save(message: CreateMessageRequest): Promise<Message>;
    delete(messageId: string): Promise<void>;
    update(messageId: string, content: string): Promise<Message>;
    listMessagesByChatId(chatId: string): Promise<Message[]>;
    findById(messageId: string): Promise<Message | null>;
}
