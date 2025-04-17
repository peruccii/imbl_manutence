import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';
import { ChatModule } from './infra/database/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from './infra/database/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HttpModule,
    ChatModule,
    ReportModule,
  ],
})
export class AppModule {}
