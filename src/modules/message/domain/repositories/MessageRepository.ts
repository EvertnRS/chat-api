import { CreateMessageRequest } from "../../../../@types/message/CreateMessageRequest";
import { UpdateMessageRequest } from '../../../../@types/message/UpdateMessageRequest';
import { ListMessageRequest } from '../../../../@types/message/ListMessageRequest';
import { Message } from "../../../message/domain/entities/Message";
import { IMessageRepository } from "./IMessageRepository";
import { mongo } from '../../../../infra/database/prismaClient';
import type { MessageResponse } from "../../../../@types/message/MessageResponse";

export class MessageRepository implements IMessageRepository {
    async save(createMessage: CreateMessageRequest): Promise<MessageResponse> {
        const { sender, recipient, content, fileURL, sentAt } = createMessage;
        const data = await mongo.message.create({
            data: {
                sender,
                recipient,
                text: content,
                file: fileURL,
                sentAt
            }
        });

        return {
            ...data,
            sentAt: data.sentAt.toISOString()
        };
    }

    async delete(messageId: string): Promise<void> {
        await mongo.message.delete({
            where: { id: messageId }
        });
    }

    async update(updateMessageRequest: UpdateMessageRequest): Promise<MessageResponse> {
        const { messageId, newContent } = updateMessageRequest;
        const data = await mongo.message.update({
            where: { id: messageId },
            data: {
                text: newContent
            }
        });

        return {
            ...data,
            sentAt: data.sentAt.toISOString()
        };
    }

    async listMessagesByChatId(listMessagesRequest: ListMessageRequest): Promise<MessageResponse[]> {
        const { chatId, page = 1, limit = 10 } = listMessagesRequest;

        const messages = await mongo.message.findMany({
            where: { 
                recipient: chatId 
                },
            orderBy: { sentAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit
        });

        return messages.map(message => ({
            ...message,
            sentAt: message.sentAt.toISOString()
        }));
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