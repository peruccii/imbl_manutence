import { User } from '@application/entities/user';
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

interface ClientData {
  user?: User;
}

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  private async authenticateClient(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) throw new WsException('Token JWT não fornecido');
    const user = await this.authService.validateToken(token);
    if (!user) throw new WsException('Token JWT inválido');
    client.data.user = user;
    return user;
  }

  async handleConnection(client: Socket) {
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

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomName: string) {
    const clientData: ClientData = client.data as ClientData;
    if (!clientData.user) throw new WsException('Usuário não autenticado');

    const room = await this.chatRepository.findRoom(roomName);
    if (!room) throw new WsException('Sala não encontrada');

    const manutence = await this.chatRepository.findManutenceByChatRoom(
      room.id,
    );
    if (!manutence)
      throw new WsException('Manutenção associada não encontrada');

    const isAuthorized =
      manutence.userId === clientData.user.id ||
      manutence.adminId === clientData.user.id;
    if (!isAuthorized)
      throw new WsException('Usuário não autorizado para essa sala');

    const currentUsers = await this.chatRepository.getUsersInRoom(roomName);
    if (
      currentUsers.length >= 2 &&
      !currentUsers.some((u) => u.id === clientData!.user!.id)
    ) {
      throw new WsException('A sala já está cheia');
    }

    client.join(roomName);
    client.emit('room-joined', { message: `Você entrou na sala: ${roomName}` });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName: string) {
    const clientData: ClientData = client.data as ClientData;
    if (!clientData.user) throw new WsException('Usuário não autenticado');

    client.leave(roomName);
    client.emit('room-left', { message: `Você saiu da sala: ${roomName}` });
  }

  @SubscribeMessage('NewMessage')
  async handleNewMessage(
    client: Socket,
    @MessageBody() message: { roomName: string; content: string },
  ) {
    const clientData: ClientData = client.data as ClientData;
    if (!clientData.user) throw new WsException('Usuário não autenticado');

    const { roomName, content } = message;
    const room = await this.chatRepository.findRoom(roomName);
    if (!room) throw new WsException('Sala não encontrada');

    this.server.to(roomName).emit('message', {
      user: clientData.user.name,
      content,
    });

    const sendRequest: SendMessageInterface = {
      msg: content,
      roomName: roomName,
      senderId: clientData.user.id,
    };
    await this.chatRepository.sendMessage(sendRequest);
  }
}
