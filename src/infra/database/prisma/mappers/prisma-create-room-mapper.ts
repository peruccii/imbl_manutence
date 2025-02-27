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
          content: msg.content ?? null,
          sender: null, // must be null
        })),
      },
    };
  }
}

// Messages de inicio tem que ser vazio
// todos os admins user tem acesso a todos os mesmos chats ?
// o chat ja comeca com algum tipo de texto tipi descricao da manutencao ?
