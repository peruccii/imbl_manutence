import type { CreateChatRoomRequest } from '@application/interfaces/create-room';

export class PrismaCreateRoomMapper {
  static toPrisma(createRoomRequest: CreateChatRoomRequest) {
    const { name, users } = createRoomRequest;
    return {
      name: name,
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
    };
  }
}
