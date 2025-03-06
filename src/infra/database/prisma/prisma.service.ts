import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma conectado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao conectar Prisma:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
