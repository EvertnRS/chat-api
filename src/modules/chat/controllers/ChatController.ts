import { Request, Response } from 'express';
import { IChatRepository } from '../domain/repositories/IChatRepository';
import { CreateChat, UpdateChat, DeleteChat, ListChats, ExitChat } from '../cases';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IStorageProvider } from '../../../infra/providers/storage/IStorageProvider';

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

export class ChatController {
    constructor(
        private readonly chatRepository: IChatRepository, 
        private readonly userRepository: IUserRepository,
        private readonly storageProvider: IStorageProvider,
        
    ) {}

    async createChat(req: Request, res: Response){
        const { name, description } = req.body;
        const photo = req.file;
        const creator = req.user?.id;
        
        if (!creator) {
            return res.status(400).json({ error: "Creator id is required" });
        }

        let participants: string[];

        try {
            participants = JSON.parse(req.body.participants);
            participants.push(creator);
        } catch {
            return res.status(400).json({ error: "Invalid participants format" });
        }

        const createChat = new CreateChat(this.chatRepository, this.userRepository, this.storageProvider);

        try {
            const chat = await createChat.create({ name, description, photo, participants, creator });
            return res.status(201).json(chat);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateChat(req: Request, res: Response){
        const { id } = req.params;
        const { name, description } = req.body;
        const photo = req.file;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(400).json({ error: "user id is required" });
        }
        
        let participants: string[];

        if(req.body.participants !== undefined && req.body.participants !== '') {
            try {
                participants = JSON.parse(req.body.participants);
            } catch {
                return res.status(400).json({ error: "Invalid participants format" });
            }
        } else {
            participants = [];
        }

        const updateChat = new UpdateChat(this.chatRepository, this.userRepository, this.storageProvider);

        try {
            const chat = await updateChat.update({ name, description, photo, participants }, id, userId);
            return res.status(200).json(chat);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteChat(req: Request, res: Response){
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: "User id is required" });
        }
        
        const deleteChat = new DeleteChat(this.chatRepository, this.userRepository, this.storageProvider);

        try{
            await deleteChat.delete(id, userId);
            return res.status(204).json();
        }
        catch(error: any) {
            return res.status(400).json({ error: error.message });
        }

    }

    async listChats(req: Request, res: Response){
        const searchTerm = req.query.search?.toString() || '';
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: "User id is required" });
        }

        const listChats = new ListChats(this.chatRepository);

        try{
            const chats = await listChats.list(searchTerm, userId);
            return res.status(200).json(chats);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }

    }

    async exitChat(req: Request, res: Response) {
        const { id } = req.params;
        console.log(req.user)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: "User id is required" });
        }

        const exitChat = new ExitChat(this.chatRepository);

        try {
            await exitChat.exit(id, userId);
            return res.status(200).json({ message: "Successfully exited the chat" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

