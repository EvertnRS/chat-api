import { Request, Response } from 'express';
import { IChatRepository } from '../domain/repositories/IChatRepository';
import { CreateChat, UpdateChat } from '../cases';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IStorageProvider } from '../../../infra/providers/bucket/IStorageProvider';

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
        
        let participants: string[];

        try {
            participants = JSON.parse(req.body.participants);
        } catch {
            return res.status(400).json({ error: "Invalid participants format" });
        }

        const createChat = new CreateChat(this.chatRepository, this.userRepository, this.storageProvider);

        try {
            const chat = await createChat.create({ name, description, photo, participants });
            return res.status(201).json(chat);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateChat(req: Request, res: Response){
        const { id } = req.params;
        console.log(id);
        console.log(req.body);
        const { name, description } = req.body;
        const photo = req.file;
        
        let participants: string[];

        try {
            participants = JSON.parse(req.body.participants);
        } catch {
            return res.status(400).json({ error: "Invalid participants format" });
        }

        const updateChat = new UpdateChat(this.chatRepository, this.userRepository, this.storageProvider);

        try {
            const chat = await updateChat.update({ name, description, photo, participants }, id);
            return res.status(200).json(chat);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteChat(req: Request, res: Response){

    }

    async listChats(req: Request, res: Response){

    }
}

