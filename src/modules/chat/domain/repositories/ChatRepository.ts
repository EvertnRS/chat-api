import { CreateChatRequest } from '../../../../@types/chat/CreateChatRequest';
import { UpdateChatRequest } from '../../../../@types/chat/UpdateChatRequest';
import { DeleteChatRequest } from '../../../../@types/chat/DeleteChatRequest';
import { ListChatsRequest } from "../../../../@types/chat/ListChatsRequest";
import { Chat } from '../entities/Chat';
import { IChatRepository } from './IChatRepository';
import { mongo } from '../../../../infra/database/prismaClient';
import { ChatResponse } from '../../../../@types/chat/ChatResponse';

export class ChatRepository implements IChatRepository {  
	  async save(createChat: CreateChatRequest): Promise<ChatResponse> {
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

        return {
            ...data,
            description: data.description === null ? undefined : data.description,
            photo: data.photo === null ? undefined : data.photo
        };
    }

    async update(updateChat: UpdateChatRequest, id: string): Promise<ChatResponse> {
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
  
    return {
            ...data,
            description: data.description === null ? undefined : data.description,
            photo: data.photo === null ? undefined : data.photo
        };
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

    async findByName(listChats: ListChatsRequest): Promise<ChatResponse[] | null> {
      const { search, page = 1, limit = 10, userId } = listChats;

      const query: any = {};

      if (search) {
        query.name = {
          contains: search
        };
      }

      const data = await mongo.chat.findMany({
        where: query,
        orderBy: {
          lastMessageAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      });

      return data.length > 0
        ? data.map(chat => ({
            ...chat,
            description: chat.description === null ? undefined : chat.description,
            photo: chat.photo === null ? undefined : chat.photo
          }))
        : null;
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

    async updateLastMessageTime(chatId: string, newDate : Date): Promise<void> {
        await mongo.chat.update({
            where: { id: chatId },
            data: { lastMessageAt: newDate }
        });
    }

    async listParticipantsByChatId(chatId: string): Promise<string[]> {
      const chat = await mongo.chat.findUnique({
        where: { id: chatId },
        select: { participants: true }
      });

      return chat?.participants ?? [];
    }

    async isUserInChat(chatId: string, userId: string): Promise<boolean> {
        const chat = await mongo.chat.findUnique({
            where: { id: chatId },
            select: { participants: true }
        });

        if (!chat) {
            return false;
        }

        return chat.participants.includes(userId);
    }
}