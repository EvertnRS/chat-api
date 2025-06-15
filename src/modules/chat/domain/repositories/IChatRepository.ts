import { CreateChatRequest } from "../../../../@types/chat/CreateChatRequest";
import { Chat } from "../entities/Chat";

export interface IChatRepository {
    save(createChat: CreateChatRequest): Promise<Chat>;
}