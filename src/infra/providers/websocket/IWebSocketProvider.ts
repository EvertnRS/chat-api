export interface IWebSocketProvider {
    sendNewMessage(recipient: string, content: string, fileURL?: string): Promise<void>;
}