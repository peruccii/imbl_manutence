import { CreateChatRoomRequest } from '@application/interfaces/create-room';

export class PrismaCreateRoomMapper {
  static toPrisma(createRoomRequest: CreateChatRoomRequest) {
    const { messages, name, users } = createRoomRequest;
    return {
      name: name,
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
      messages: {
        create: messages.map((msg) => ({
          content: msg.content,
          sender: { connect: { id: msg.senderId } },
        })),
      },
    };
  }
}
