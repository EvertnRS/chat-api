import { CreateChatRequest } from '../../../../@types/chat/CreateChatRequest';
import { UpdateChatRequest } from '../../../../@types/chat/UpdateChatRequest';
import { DeleteChatRequest } from '../../../../@types/chat/DeleteChatRequest';
import { ListChatsRequest } from "../../../../@types/chat/ListChatsRequest";
import { Chat } from '../entities/Chat';
import { IChatRepository } from './IChatRepository';
import { mongo } from '../../../../infra/database/prismaClient';

export class ChatRepository implements IChatRepository {  
	async save(createChat: CreateChatRequest): Promise<Chat> {
        const { name, description, fileURL, participants, creator } = createChat;
        const data = await mongo.chat.create({
            data: {
                name,
                description,
                photo: fileURL,
                participants,
                creator
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

  async delete (deleteChat : DeleteChatRequest): Promise<void> {
      const { id } = deleteChat;
      await mongo.chat.delete({
        where: { id }});
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

    async findByName(listChats: ListChatsRequest): Promise<Chat[] | null> {
      const { search, userId } = listChats;

      const query: any = {
        participants: {
          has: userId
        }
      };

      if (search) {
        query.name = {
          contains: search,
          mode: 'insensitive'
        };
      }

      const data = await mongo.chat.findMany({
        where: query,
        orderBy: {
          lastMessageAt: 'desc'
        }
      });

      return data.length > 0 ? data : null;
    }

    async exitChat(id: string, userId: string): Promise<void> {
        const participants = await mongo.chat.findUnique({
            where: { id },
            select: { participants: true }
        });

        if (!participants || !participants.participants.includes(userId)) {
            throw new Error('User is not a participant of this chat');
        }

        const updatedParticipants = participants.participants.filter(participant => participant !== userId);

        await mongo.chat.update({
            where: { id },
            data: {
                participants: {
                    set: updatedParticipants
                }
            }
        });
    }

}