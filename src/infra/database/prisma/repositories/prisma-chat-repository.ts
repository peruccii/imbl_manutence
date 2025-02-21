import { ChatRoom } from "@application/entities/chat_room";
import { ChatRepository } from "@application/repositories/chat-repository";
import { PrismaService } from "../prisma.service";
import { PrismaChatRoomMapper } from "../mappers/prisma-chat-mapper";

export class PrismaChatRepository implements ChatRepository {
    constructor(private readonly prismaService: PrismaService) {}


    async sendMessage(msg: string, roomName: string, id: string): Promise<void> {
        
        // 1 - find room
        const room = await this.findRoom(roomName)

        if (!room) {
            throw new Error('')
        }

        const chatRoom = PrismaChatRoomMapper.toDomain(room)

        // 2 - create messages on room finded
        const sendMsg = await this.prismaService.message.create({
            data: {
                content: msg,
                chatRoom: chatRoom,
                senderId: id,
            }
        })
        // 3 -
        
        throw new Error("Method not implemented.");
    }

    async findRoom(roomName: string): Promise<ChatRoom | null> {
        //const room = await this.prismaService.chatRoom.findFirst({
           // where: { name: roomName }
       // })

        //if (room) {
         //   return PrismaChatRoomMapper.toDomain(room)
       // }

        return null
    }

    createRoom(roomName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}