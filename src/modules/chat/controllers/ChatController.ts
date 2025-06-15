import { Request, Response } from 'express';
import { IChatRepository } from '../domain/repositories/IChatRepository';
import { CreateChat } from '../cases/createChat';
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
            // Se vier como JSON string (exemplo: '["id1", "id2"]')
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

    }

    async deleteChat(req: Request, res: Response){

    }

    async listChats(req: Request, res: Response){

    }
}

