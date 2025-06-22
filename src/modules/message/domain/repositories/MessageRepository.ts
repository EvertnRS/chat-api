import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { Message } from "../../../message/domain/entities/Message";
import { IMessageRepository } from "./IMessageRepository";
import { mongo } from '../../../../infra/database/prismaClient';

export class MessageRepository implements IMessageRepository {
    async save(createMessage: CreateMessageRequest): Promise<Message> {
        const { sender, recipient, content, fileURL } = createMessage;
        const data = await mongo.message.create({
            data: {
                sender,
                recipient,
                text: content,
                file: fileURL
            }
        });

        return data;
    }
    
    async delete(messageId: string): Promise<void> {
        await mongo.message.delete({
            where: { id: messageId }
        });
    }
    update(messageId: string, content: string): Promise<Message> {
        throw new Error("Method not implemented.");
    }
    listMessagesByChatId(chatId: string): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }
    findById(messageId: string): Promise<Message | null> {
        return mongo.message.findUnique({
            where: { id: messageId }
        });
    }
}