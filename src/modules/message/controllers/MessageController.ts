import { Request, Response } from "express";
import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { IChatRepository } from "../../chat/domain/repositories/IChatRepository";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IWebSocketProvider } from "../../../infra/providers/websocket/IWebSocketProvider";
import { CreateMessage } from "../cases/CreateMessage";
import { DeleteMessage } from "../cases/DeleteMessage";

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
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}