export type CreateMessageRequest = {
    sender: string;
    recipient: string;
    content: string;
    file?: Express.Multer.File;
    fileURL?: string;
}