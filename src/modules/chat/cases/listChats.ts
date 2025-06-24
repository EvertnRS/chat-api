import { IChatRepository } from "../domain/repositories/IChatRepository";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { ChatResponse } from "../../../@types/chat/ChatResponse";

export class ListChats {
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository
    ) { }

    async list(search: string, page:number = 1, limit:number = 10, userId: string): Promise<ChatResponse[]> {
        const user = await this.userRepository.findById(userId);
        
        if (!user) {
            throw new Error("User not found");
        }

        const chats = await this.chatRepository.findByName({ search, page, limit, userId: user.id }) ?? [];

        const filteredChats = chats
            .filter(chat => chat.participants.includes(user.id))
            .map(chat => ({
                id: chat.id,
                name: chat.name,
                description: chat.description,
                photo: chat.photo, 
                participants: chat.participants,
                creator: chat.creator, 
                lastMessageAt: chat.lastMessageAt, 
                createdAt: chat.createdAt
            }));
            
        return filteredChats;
    }
}