import { IChatRepository } from "../domain/repositories/IChatRepository";
import { Chat } from "../domain/entities/Chat";
import { ChatResponse } from "../../../@types/chat/ChatResponse";

export class ListChats{
    constructor(private readonly chatRepository: IChatRepository) {}
    
    async list(search : string, userId : string) : Promise<ChatResponse[] | null> {
        const chats = this.chatRepository.findByName({search, userId});
        return chats
    }
}