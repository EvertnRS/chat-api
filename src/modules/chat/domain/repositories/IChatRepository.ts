import { CreateChatRequest } from "../../../../@types/chat/CreateChatRequest";
import { UpdateChatRequest } from "../../../../@types/chat/UpdateChatRequest";
import { Chat } from "../entities/Chat";

export interface IChatRepository {
    save(createChat: CreateChatRequest): Promise<Chat>;
    findById(id: string): Promise<Chat | null>;
    update(updateChat: UpdateChatRequest, id: string): Promise<Chat>;
}