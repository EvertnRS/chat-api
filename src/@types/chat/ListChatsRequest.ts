export type ListChatsRequest = {
    search?: string;
    userId: string;
    limit?: number;
    page?: number;
}