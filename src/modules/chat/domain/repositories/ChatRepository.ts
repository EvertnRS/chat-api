import { CreateChatRequest } from '../../../../@types/chat/CreateChatRequest';
import { UpdateChatRequest } from '../../../../@types/chat/UpdateChatRequest';
import { Chat } from '../entities/Chat';
import { IChatRepository } from './IChatRepository';
import { mongo } from '../../../../infra/database/prismaClient';

export class ChatRepository implements IChatRepository {
	async save(createChat: CreateChatRequest): Promise<Chat> {
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

    async update(updateChat: UpdateChatRequest, id: string): Promise<Chat> {
    const { name, description, fileURL, participants } = updateChat;
    const data = await mongo.chat.update({
      where: { id },
      data: {
        name,
        description,
        photo: fileURL,
        participants
      }
    });
  
    return data;
  }

    async findById(id: string): Promise<Chat | null> {
        const data = await mongo.chat.findUnique({
        where: { id }
        });

        if (!data) {
            return null;
        }

        return data;
    }
}