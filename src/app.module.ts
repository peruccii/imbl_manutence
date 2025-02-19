import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';
import { ChatModule } from './infra/database/chat/chat.module';

@Module({
  imports: [DatabaseModule, HttpModule, ChatModule],
})
export class AppModule {}
