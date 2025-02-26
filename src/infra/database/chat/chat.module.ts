import { Module } from '@nestjs/common';
import { ChatGateway } from './chat-gateway';
import { ChatRepository } from '@application/repositories/chat-repository';
import { PrismaChatRepository } from '../prisma/repositories/prisma-chat-repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    ChatGateway,
    {
      provide: ChatRepository,
      useClass: PrismaChatRepository,
    },
  ],
  exports: [ ChatRepository],
})
export class ChatModule {}
