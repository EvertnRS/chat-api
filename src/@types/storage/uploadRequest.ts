export type UploadRequest = {
    fileBuffer: Buffer;
    fileName: string;
    mimeType: string;
    userId: string;
    chatId: string;
    type: 'image' | 'video' | 'audio';
}