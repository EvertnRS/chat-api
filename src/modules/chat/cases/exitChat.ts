import { IChatRepository } from "../domain/repositories/IChatRepository";
import { Chat } from "../domain/entities/Chat";

export class ExitChat{
    constructor(private readonly chatRepository: IChatRepository) {}
    
    async exit(id: string, userId: string) : Promise<void> {
        const chat: Chat | null = await this.chatRepository.findById(id);
        
        if (!chat) {
            throw new Error("Chat not found");
        }

        if (!chat.participants.includes(userId)) {
            throw new Error("User is not a participant of this chat");
        }

        await this.chatRepository.exitChat(id, userId);
    }
}