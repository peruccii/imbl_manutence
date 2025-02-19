import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Socket, Server } from 'socket.io'

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Conectando usuário...', client.id)

        client.broadcast.emit('user-joined', {
            message: `Usuário se conectou ao chat ${client.id}`
        })
    }

    handleDisconnect(client: Socket) {
        console.log('Usuário se desconectando...')
    
        this.server.emit('user-left', {
            message: `Usuário se desconectou ao chat ${client.id}`
        })
    }

    @SubscribeMessage('NewMessage')
    handleNewMessage(@MessageBody() message: string) {
        this.server.emit('message', message)
    }
}