import { CreateChatRequest } from "../../../../@types/chat/CreateChatRequest";
import { UpdateChatRequest } from "../../../../@types/chat/UpdateChatRequest";
import { DeleteChatRequest } from "../../../../@types/chat/DeleteChatRequest";
import { ListChatsRequest } from "../../../../@types/chat/ListChatsRequest";
import { Chat } from "../entities/Chat";
import { ChatResponse } from "../../../../@types/chat/ChatResponse";

export interface IChatRepository {
    save(createChat: CreateChatRequest): Promise<ChatResponse>;
    update(updateChat: UpdateChatRequest, id: string): Promise<ChatResponse>;
    delete(deleteChat: DeleteChatRequest): Promise<void>;
    findByName(listChats : ListChatsRequest): Promise<Chat[] | null>;
    findById(id: string): Promise<Chat | null>;
    exitChat(id: string, userId: string): Promise<void>;
    updateLastMessageTime(chatId: string, newDate : Date): Promise<void>;
    listParticipantsByChatId(chatId: string): Promise<string[]>;
    isUserInChat(chatId: string, userId: string): Promise<boolean>;
}