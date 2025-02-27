import { CreateChatRoomRequest } from '@application/interfaces/create-room';
import { SendMessageInterface } from '@application/interfaces/send-message';
import { ChatRepository } from '@application/repositories/chat-repository';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  private async authenticateClient(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new WsException('Token JWT não fornecido');
    }

    try {
      const user = await this.authService.validateToken(token);
      if (!user) {
        throw new WsException('Token JWT inválido');
      }
      client.data.user = user;
      return user;
    } catch (err) {
      throw new WsException('Erro na autenticação do token');
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('Conectando usuário...', client.id);

    try {
      const user = await this.authenticateClient(client);
      console.log(`Usuário ${user.id} conectado com sucesso.`);

      client.broadcast.emit('user-joined', {
        message: `Usuário ${user.name} se conectou ao chat ${client.id}`,
      });
    } catch (error) {
      console.log('Erro de autenticação', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Usuário se desconectando...');

    if (client.data?.user) {
      this.server.emit('user-left', {
        message: `Usuário ${client.data.user.name} se desconectou`,
      });
    }
  }

  // i will use this on frontend ( button [ click - join room ])
  // socket.emit('joinRoom', 'roomNametest')
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomName: string) {
    if (!client.data?.user) {
      throw new WsException('Usuário não autenticado');
    }

    const roomExists = await this.chatRepository.findRoom(roomName);

    // should not be able to open in chat if its already two users in there ??

    if (!roomExists) {
      const createRoomRequest: CreateChatRoomRequest = {
        name: roomName,
        users: client.data.user,
        messages: [],
      };
      await this.chatRepository.createRoom(createRoomRequest);
    }

    const currentUsersInRoom = await this.chatRepository.getUsersInRoom(roomName)


    client.join(roomName);
    client.emit('room-joined', { message: `Você entrou na sala: ${roomName}` });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName: string) {
    if (!client.data?.user) {
      throw new WsException('Usuário não autenticado');
    }

    client.leave(roomName);
    client.emit('room-left', { message: `Você saiu na sala: ${roomName}` });
  }

  // front- socket.emit('NewMessage', message: { 'room', 'hello world' })
  @SubscribeMessage('NewMessage')
  handleNewMessage(
    client: Socket,
    @MessageBody() message: { roomName: string; content: string },
  ) {
    if (!client.data?.user) {
      throw new WsException('Usuário não autenticado');
    }

    const { roomName, content } = message;

    this.server.to(roomName).emit('message', {
      user: client.data.user.name,
      content,
    });

    const id = client.data.user.id;

    const send_request: SendMessageInterface = {
      msg: content,
      roomName: roomName,
      senderId: id,
    };

    this.chatRepository.sendMessage(send_request);
  }
}
