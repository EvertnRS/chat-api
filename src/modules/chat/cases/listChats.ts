import { IChatRepository } from "../domain/repositories/IChatRepository";
import { Chat } from "../domain/entities/Chat";

export class ListChats{
    constructor(private readonly chatRepository: IChatRepository) {}
    
    async list(search : string, userId : string) : Promise<Chat[] | null> {
        const chats = this.chatRepository.findByName({search, userId});
        return chats
    }
}