export type UpdateMessageRequest = {
    sender: string,
    recipient: string,
    messageId: string,
    newContent: string
}