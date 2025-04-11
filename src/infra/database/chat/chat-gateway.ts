import { User } from '@application/entities/user';
import { SendMessageInterface } from '@application/interfaces/send-message';
import { ChatRepository } from '@application/repositories/chat-repository';
import {
  ConnectedSocket,
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
import { Message } from '@application/entities/message';

interface ClientData {
  user?: User;
}

@WebSocketGateway(3002, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  private async authenticateClient(client: Socket) {
    try {
      const token =
        client.handshake.headers.authorization?.split(' ')[1] ||
        client.handshake.auth.token ||
        client.handshake.query.token;
      console.log('Token recebido:', token);

      if (!token) {
        console.log('Token não encontrado');
        throw new WsException('Token JWT não fornecido');
      }

      const user = await this.authService.validateToken(token);
      console.log('Usuário validado:', user);

      if (!user) {
        console.log('Usuário não encontrado');
        throw new WsException('Token JWT inválido');
      }

      client.data.user = user;
      return user;
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  }

  async handleConnection(client: Socket) {
    console.log('Conectando usuário...', client.id);
    try {
      const user = await this.authenticateClient(client);
      console.log(`Usuário ${user.id} conectado com sucesso.`);

      client.emit('connection-success', {
        message: 'Conexão estabelecida com sucesso',
        user: {
          id: user.id,
          name: user.name.value,
        },
      });

      client.broadcast.emit('user-joined', {
        message: `Usuário ${user.name.value} se conectou ao chat`,
        user: {
          id: user.id,
          name: user.name.value,
        },
      });
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      client.emit('connection-error', {
        message: 'Erro na autenticação',
        error: error.message || 'Erro desconhecido',
      });
      client.disconnect();
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomName: string) {
    try {
      const clientData: ClientData = client.data as ClientData;
      console.log('Dados do cliente:', clientData);
      if (!clientData.user) {
        console.log('Tentativa de join sem autenticação');
        throw new WsException('Usuário não autenticado');
      }
      roomName = 'VAZAMENTO NO TETO';
      console.log('Cliente tentando entrar na sala:', roomName);
      const room = await this.chatRepository.findRoom(roomName);
      if (!room) throw new WsException('Sala não encontrada');

      const manutence = await this.chatRepository.findManutenceByChatRoom(
        room.id,
      );
      if (!manutence)
        throw new WsException('Manutenção associada não encontrada');
      console.log('Manutenção admin id:', manutence.adminId);
      console.log('Manutenção user id:', manutence.userId);
      const isAuthorized =
        manutence.userId === clientData.user.id ||
        manutence.adminId === clientData.user.id;
      if (!isAuthorized)
        throw new WsException('Usuário não autorizado para essa sala');

      const currentUsers = await this.chatRepository.getUsersInRoom(roomName);
      console.log('Usuários atuais na sala:', currentUsers);
      if (
        currentUsers.length >= 2 &&
        !currentUsers.some((u) => u.id === clientData.user!.id)
      ) {
        throw new WsException('A sala já está cheia');
      }

      client.join(roomName);
      client.emit('room-joined', {
        message: `Você entrou na sala: ${roomName}`,
        room: {
          id: room.id,
          name: room.name,
        },
      });
    } catch (error: any) {
      console.error('Erro ao entrar na sala:', error);
      client.emit('room-error', {
        message: error.message || 'Erro ao entrar na sala',
      });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, roomName: string) {
    try {
      console.log('Cliente tentando sair da sala:', client.id);
      console.log('Dados do cliente:', client.data);

      const clientData: ClientData = client.data as ClientData;
      if (!clientData.user) {
        console.log('Tentativa de sair da sala sem autenticação');
        throw new WsException('Usuário não autenticado');
      }

      client.leave(roomName);
      client.emit('room-left', {
        message: `Você saiu da sala: ${roomName}`,
        room: {
          name: roomName,
        },
      });
    } catch (error: any) {
      console.error('Erro ao sair da sala:', error);
      client.emit('room-error', {
        message: error.message || 'Erro ao sair da sala',
      });
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Usuário se desconectando...');
    if (client.data?.user) {
      this.server.emit('user-left', {
        message: `Usuário ${client.data.user.name.value} se desconectou`,
        user: {
          id: client.data.user.id,
          name: client.data.user.name.value,
        },
      });
    }
  }

  @SubscribeMessage('newMessage')
  async handleNewMessage(
    @MessageBody() message: { roomName: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('Recebendo nova mensagem:', message);
      console.log('Dados do cliente:', client.data);

      const clientData: ClientData = client.data as ClientData;
      if (!clientData.user) {
        console.log('Tentativa de enviar mensagem sem autenticação');
        throw new WsException('Usuário não autenticado');
      }

      const { roomName, content } = message;
      const room = await this.chatRepository.findRoom(roomName);
      if (!room) throw new WsException('Sala não encontrada');

      const newMessage = new Message({
        content,
        senderId: clientData.user.id,
        chatRoomId: room.id,
        createdAt: new Date(),
        isRead: false,
      });

      await this.chatRepository.createMessage(newMessage);

      const messageData = {
        id: newMessage.id,
        user: clientData.user.name.value,
        content,
        createdAt: newMessage.createdAt,
        isRead: newMessage.isRead,
        roomName,
      };

      console.log('Mensagem enviada:', messageData);

      console.log('Enviando mensagem:', messageData);
      this.server.to(roomName).emit('message', messageData);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      client.emit('message-error', {
        message: error.message || 'Erro ao enviar mensagem',
      });
    }
  }
}
