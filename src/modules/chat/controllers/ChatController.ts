import { Request, Response } from 'express';
import { IChatRepository } from '../domain/repositories/IChatRepository';
import { CreateChat, UpdateChat, DeleteChat, ListChats, ExitChat } from '../cases';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IStorageProvider } from '../../../infra/providers/storage/IStorageProvider';
import { CreateChatBodySchema, UpdateChatBodySchema, ChatParamsSchema, ListChatQuerySchema } from '../dto';
import { ChatResponse } from '../../../@types/chat/ChatResponse';
import { UserParamsSchema } from '../../user/dto';

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

export class ChatController {
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository,
        private readonly storageProvider: IStorageProvider,

    ) { }

    async createChat(req: Request, res: Response) {
        const rawParticipants = req.body.participants;
        let participantsArray: string[] = [];

        if (typeof rawParticipants === 'string') {
            try {
                const parsed = JSON.parse(rawParticipants);
                participantsArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                participantsArray = [rawParticipants];
            }
        } else if (Array.isArray(rawParticipants)) {
            participantsArray = rawParticipants;
        } else if (rawParticipants) {
            participantsArray = [rawParticipants];
        }

        
        try {
            const body = CreateChatBodySchema.parse({ name: req.body.name, description: req.body.description, participants: participantsArray, file: req.file });
            
            const user = UserParamsSchema.parse({ id: req.user?.id });
            
            participantsArray.push(user.id);
            const createChat = new CreateChat(this.chatRepository, this.userRepository, this.storageProvider);
            
            const chat: ChatResponse = await createChat.create({
                name: body.name,
                description: body.description,
                photo: body.file,
                participants: participantsArray,
                creator: user.id,
            });

            return res.status(201).json(chat);

        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async updateChat(req: Request, res: Response) {
        const rawParticipants = req.body.participants;
        let participantsArray: string[] = [];

        if (typeof rawParticipants === 'string') {
            try {
                const parsed = JSON.parse(rawParticipants);
                participantsArray = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                participantsArray = [rawParticipants];
            }
        } else if (Array.isArray(rawParticipants)) {
            participantsArray = rawParticipants;
        } else if (rawParticipants) {
            participantsArray = [rawParticipants];
        }

        
        try {
            const updateChat = new UpdateChat(this.chatRepository, this.userRepository, this.storageProvider);
            const body = UpdateChatBodySchema.parse({ name: req.body.name, description: req.body.description, participants: participantsArray, file: req.file });
            const user = UserParamsSchema.parse({ id: req.user?.id });
            const { id } = ChatParamsSchema.parse({id: req.params.id});
            const chat: ChatResponse = await updateChat.update({ 
                name: body.name, 
                description: body.description, 
                photo: body.file, 
                participants: participantsArray 
            }, id, user.id);
            return res.status(200).json(chat);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteChat(req: Request, res: Response) {
        try {
            const user = UserParamsSchema.parse({ id: req.user?.id });
            const { id } = ChatParamsSchema.parse({id: req.params.id});
            const deleteChat = new DeleteChat(this.chatRepository, this.userRepository, this.storageProvider);
            await deleteChat.delete(id, user.id);
            return res.status(204).json();
        }
        catch (error: any) {
            return res.status(400).json({ error: error.message });
        }

    }

    async listChats(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, searchTerm } = ListChatQuerySchema.parse(req.query.searchTerm ? { ...req.query, searchTerm: req.query.searchTerm } : req.query);
            const userId = UserParamsSchema.parse({ id: req.user?.id }).id;
            const listChats = new ListChats(this.chatRepository, this.userRepository);
            const chats: ChatResponse[] = (await listChats.list(searchTerm ?? '', page, limit, userId)) || [];
            return res.status(200).json(chats);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }

    }

    async exitChat(req: Request, res: Response) {
        try {
            const userId = UserParamsSchema.parse({ id: req.user?.id }).id;
            const { id } = ChatParamsSchema.parse({id: req.params.id});
            const exitChat = new ExitChat(this.chatRepository, this.userRepository);
            await exitChat.exit(id, userId);
            return res.status(200).json({ message: "Successfully exited the chat" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

