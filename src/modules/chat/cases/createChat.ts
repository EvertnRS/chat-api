import { CreateChatRequest } from "../../../@types/chat/CreateChatRequest";
import { IStorageProvider } from "../../../infra/providers/bucket/IStorageProvider";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { Chat } from "../domain/entities/Chat";
import { IChatRepository } from "../domain/repositories/IChatRepository";


export class CreateChat {
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository,
        private readonly storageProvider: IStorageProvider,
    ) 
    {}

    async create({ name, description, photo, participants }: CreateChatRequest): Promise<Chat> {
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

        
        const chat = {
            name,
            description,
            fileURL,
            participants
        };
        
        return this.chatRepository.save(chat);
    }

}
