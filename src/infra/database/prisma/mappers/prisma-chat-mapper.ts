import { ChatRoom, ChatRoom as RawChatRoom } from "@application/entities/chat_room";

export class PrismaChatRoomMapper {
    static toDomain(rawChatRoom: RawChatRoom) {
        return new ChatRoom(
            {
                chatRoomId: rawChatRoom.chatRoomId,
                content: rawChatRoom.content,
                createdAt: rawChatRoom.createdAt,
                senderId: rawChatRoom.senderId
            },
            rawChatRoom.id
        )
    }
}