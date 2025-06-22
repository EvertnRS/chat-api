import { IMessageRepository } from "../domain/repositories/IMessageRepository";
import { IStorageProvider } from "../../../infra/providers/storage/IStorageProvider";

export class DeleteMessage {
    constructor(
        private readonly messageRepository: IMessageRepository,
        private readonly storageProvider: IStorageProvider
    ) {}

    async delete(id: string): Promise<void> {
        if (!id) {
            throw new Error("Message id is required");
        }

        const message = await this.messageRepository.findById(id);
        if (!message) {
            throw new Error("Message not found");
        }

        if(message.file) {
            this.storageProvider.deleteFile(message.file)
        }

        await this.messageRepository.delete(id);
    }
}
