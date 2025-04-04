import type { CreateChatRoomRequest } from '@application/interfaces/create-room';

export class PrismaCreateRoomMapper {
  static toPrisma(createRoomRequest: CreateChatRoomRequest) {
    const { name, users, id } = createRoomRequest;
    return {
      id: id,
      name: name,
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
    };
  }
  }
