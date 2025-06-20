import { CreateChatRequest } from "../../../../@types/chat/CreateChatRequest";
import { UpdateChatRequest } from "../../../../@types/chat/UpdateChatRequest";
import { DeleteChatRequest } from "../../../../@types/chat/DeleteChatRequest";
import { ListChatsRequest } from "../../../../@types/chat/ListChatsRequest";
import { Chat } from "../entities/Chat";

export interface IChatRepository {
    save(createChat: CreateChatRequest): Promise<Chat>;
    update(updateChat: UpdateChatRequest, id: string): Promise<Chat>;
    delete(deleteChat: DeleteChatRequest): Promise<void>;
    findByName(listChats : ListChatsRequest): Promise<Chat[] | null>;
    findById(id: string): Promise<Chat | null>;
    exitChat(id: string, userId: string): Promise<void>;
}