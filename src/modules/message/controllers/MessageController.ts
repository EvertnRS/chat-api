import { Request, Response } from "express";
import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { IChatRepository } from "../../chat/domain/repositories/IChatRepository";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IWebSocketProvider } from "../../../infra/providers/websocket/IWebSocketProvider";
import { IEmailProvider } from "../../../infra/providers/email/IEmailProvider";
import { CreateMessage, UpdateMessage, DeleteMessage, ListMessages } from "../cases";
import { CreateMessageBodySchema, MessageFileSchema, MessageParamsSchema, MessageListQuerySchema } from "../domain/dto/";
import { ChatParamsSchema } from "../../chat/dto";
import { UserParamsSchema } from "../../user/dto";

export class MessageController {
    constructor(
        private readonly messageRepository: IMessageRepository,
        private readonly userRepository: IUserRepository,
        private readonly chatRepository: IChatRepository,
        private readonly storageProvider: IStorageProvider,
        private readonly webSocketProvider: IWebSocketProvider,
        private readonly EmailProvider: IEmailProvider 
    ) {}

    async createMessage(req: Request, res: Response) {
        try {
            const { id: chatId } = ChatParamsSchema.parse(req.params);
            const { content } = CreateMessageBodySchema.parse(req.body);
            const { file } = MessageFileSchema.parse({ file: req.file });
            const sender = UserParamsSchema.parse({ id: req.user?.id }).id;
            const createMessage = new CreateMessage(this.messageRepository, this.userRepository, this.chatRepository, this.storageProvider, this.webSocketProvider, this.EmailProvider);
    
            const sentAt = new Date();
            const message = await createMessage.create({ sender, recipient: chatId, content, file, sentAt });
            return res.status(201).json(message);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteMessage(req: Request, res: Response) {
        try {
            const { id } = MessageParamsSchema.parse(req.params);
            const deleteMessage = new DeleteMessage(this.messageRepository, this.storageProvider);
            await deleteMessage.delete(id);
            return res.status(204).send();
        }  catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateMessage(req: Request, res: Response) {
        try{
            const { id: messageId } = MessageParamsSchema.parse(req.params);
            const { id: chatId } = ChatParamsSchema.parse(req.params);
            const sender = UserParamsSchema.parse({ id: req.user?.id }).id;
            const { content: newContent } = CreateMessageBodySchema.parse(req.body);
            const updatedMessage = new UpdateMessage(this.userRepository, this.chatRepository, this.messageRepository, this.webSocketProvider);
            const messageUpdated = await updatedMessage.update({ sender, recipient:chatId, messageId, newContent});
            return res.status(200).json({ messageUpdated });

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async listMessages(req: Request, res: Response) { 
        try {
            const { id: chatId } = ChatParamsSchema.parse(req.params);
            const { page = 1, limit = 10 } = MessageListQuerySchema.parse(req.query);
            const listMessages = new ListMessages(this.messageRepository, this.chatRepository);
            const messages = await listMessages.listMessages({ chatId, page, limit });
            return res.status(200).json(messages);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}