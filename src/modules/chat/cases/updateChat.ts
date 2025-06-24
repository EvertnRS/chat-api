import { ChatResponse } from "../../../@types/chat/ChatResponse";
import { UpdateChatRequest } from "../../../@types/chat/UpdateChatRequest";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { Chat } from "../domain/entities/Chat";
import { IChatRepository } from "../domain/repositories/IChatRepository";

export class UpdateChat {
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository,
        private readonly storageProvider: IStorageProvider,
    ) 
    {}

    async update({name, description, photo, participants}: UpdateChatRequest, id : string, userId : string): Promise<ChatResponse> {
        const chat = await this.chatRepository.findById(id);
        
        if (!chat) {
            throw new Error("Chat not found");
        }

        if (chat.creator !== userId) {
            throw new Error("Only the creator can update the chat");
        }
        
        let newParticipants: string[] = [];
        
        if (participants) {
            const participantUsers = await this.userRepository.findManyById(participants);
            if (participantUsers.length !== participants.length) {
                throw new Error("One or more participants not found");
            }
            newParticipants = participants.filter(item => !chat.participants.includes(item));
        }

        let newFileURL: string | undefined;

        if(photo) {
            newFileURL = await this.storageProvider.updateFile({
                fileBuffer: photo.buffer,
                fileName: photo.originalname,
                mimeType: photo.mimetype,
                oldFileUrl: chat.photo ? chat.photo : ""
            });
        }

        const updatedChat = await this.chatRepository.update({
            name,
            description,
            fileURL: newFileURL,
            participants: chat.participants.concat(newParticipants)
        }, id);

        return updatedChat;
    }
}