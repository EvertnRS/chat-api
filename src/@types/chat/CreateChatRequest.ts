export type CreateChatRequest = {
    name: string;
    description?: string;
    photo?: Express.Multer.File;
    fileURL?: string;
    participants: string[];
}
