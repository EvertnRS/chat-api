import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { UpdateMessageRequest } from '../../../../@types/message/UpdateMessageRequest';
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

    update(updateMessageRequest : UpdateMessageRequest): Promise<Message> {
        const { messageId, newContent } = updateMessageRequest;
        const data = mongo.message.update({
            where: { id: messageId },
            data: {
                text: newContent
                }
            });

        return data;
        }

    delete(messageId: string): Promise<Message> {
        throw new Error("Method not implemented.");
    }

    listMessagesByChatId(chatId: string): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }

    async findById(id: string): Promise<Message | null> {
        const data = await mongo.message.findUnique({
        where: { id }
        });

        if (!data) {
            return null;
        }

        return data;
    }
}