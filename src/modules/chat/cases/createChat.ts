import { CreateChatRequest } from "../../../@types/chat/CreateChatRequest";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { IChatRepository } from "../domain/repositories/IChatRepository";
import { Chat } from "../domain/entities/Chat";
import { ChatResponse } from "../../../@types/chat/ChatResponse";


export class CreateChat {
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository,
        private readonly storageProvider: IStorageProvider,
    ) 
    {}

    async create({ name, description, photo, participants, creator }: CreateChatRequest): Promise<ChatResponse> {
        if (!name || !participants || participants.length === 0) {
            throw new Error("Invalid chat data");
        }

        const participantUsers = await this.userRepository.findManyById(participants);
        if (participantUsers.length !== participants.length) {
            throw new Error("One or more participants not found");
        }

        let fileURL: string | undefined = undefined;

        if(photo) {
            fileURL = await this.storageProvider.uploadFile({
                fileBuffer: photo.buffer,
                fileName: photo.originalname,
                mimeType: photo.mimetype,
                folder: 'chats/photos'
            });
        }

        
        const createChat = {
            name,
            description,
            fileURL,
            participants,
            creator
        };
        
        return await this.chatRepository.save(createChat);
    }

}
