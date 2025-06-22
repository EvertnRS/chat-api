import { Request, Response } from "express";
import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { IChatRepository } from "../../chat/domain/repositories/IChatRepository";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IWebSocketProvider } from "../../../infra/providers/websocket/IWebSocketProvider";
import { CreateMessage, UpdateMessage, DeleteMessage } from "../cases";

export class MessageController {
    constructor(
        private readonly messageRepository: IMessageRepository,
        private readonly userRepository: IUserRepository,
        private readonly chatRepository: IChatRepository,
        private readonly storageProvider: IStorageProvider,
        private readonly webSocketProvider: IWebSocketProvider
    ) {}

    async createMessage(req: Request, res: Response) {
        const { chatId } = req.params;
        const { content } = req.body;
        const file = req.file;
        const sender = req.user?.id;

        if (!sender) {
            return res.status(400).json({ error: "User id is required" });
        }

        if (!chatId) {
            return res.status(400).json({ error: "Chat id is required" });
        }

        const createMessage = new CreateMessage(this.messageRepository, this.userRepository, this.chatRepository, this.storageProvider, this.webSocketProvider);

        try {
            const message = await createMessage.create({ sender, recipient: chatId, content, file });
            return res.status(201).json(message);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteMessage(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Message id is required" });
        }

        const deleteMessage = new DeleteMessage(this.messageRepository, this.storageProvider);

        try {
            await deleteMessage.delete(id);
            return res.status(204).send();
        }  catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateMessage(req: Request, res: Response) {
        const { chatId, messageId } = req.params;
        const { newContent } = req.body;
        const sender = req.user?.id;

        if (!sender) {
            return res.status(400).json({ error: "User id is required" });
        }

        if (!chatId) {
            return res.status(400).json({ error: "Chat id is required" });
        }

        if (!messageId) {
            return res.status(400).json({ error: "Message id is required" });
        }
        const updatedMessage = await new UpdateMessage(this.userRepository, this.chatRepository, this.messageRepository, this.webSocketProvider);

        try{

            const messageUpdated = await updatedMessage.update({ sender, recipient:chatId, messageId, newContent});
            return res.status(200).json({ messageUpdated });

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}