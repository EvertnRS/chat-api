import { CreateChatRequest } from '../../../../@types/chat/CreateChatRequest';
import { Chat } from '../entities/Chat';
import { IChatRepository } from './IChatRepository';
import { mongo } from '../../../../infra/database/prismaClient';

export class ChatRepository implements IChatRepository {
	async save(createChat: CreateChatRequest): Promise<Chat> {
        console.log(createChat);
        const { name, description, fileURL, participants } = createChat;
        const data = await mongo.chat.create({
            data: {
                name,
                description,
                photo: fileURL,
                participants
            }
        });

        return data;
    }
}