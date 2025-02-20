import { ChatRoom } from "@application/entities/chat_room";

export abstract class ChatRepository {
    abstract sendMessage(msg: string, roomName: string, id: string): Promise<void>
    abstract findRoom(roomName: string): Promise<ChatRoom>
    abstract createRoom(roomName: string): Promise<void>;
}