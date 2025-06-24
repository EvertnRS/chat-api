import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";
import { IUserRepository } from "../../user/domain/repositories/IUserRepository";
import { IChatRepository } from "../domain/repositories/IChatRepository";

export class DeleteChat{
    constructor(
        private readonly chatRepository: IChatRepository,
        private readonly userRepository: IUserRepository,
        private readonly storageProvider: IStorageProvider,
    ){}

    async delete(id: string, userId: string): Promise<void> {
        const chat = await this.chatRepository.findById(id);

        if (!chat) {
            throw new Error("Chat not found");
        }

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new Error("Chat not found");
        }

        if (chat.creator !== user.id) {
            throw new Error("Only the creator can delete the chat");
        }

        const fileUrl = chat.photo ? chat.photo : "";
        await this.storageProvider.deleteFile(fileUrl);
        await this.chatRepository.delete({ id });

    }
}