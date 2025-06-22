export type UpdateChatRequest = {
    name?: string,
    description?: string,
    photo?: Express.Multer.File,
    fileURL?: string,
    participants?: string[]
}
