import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ManutenceModule } from "./manutence/manutence.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
}),
        PrismaModule,
        UserModule,
        ManutenceModule
    ],
    exports: [
        PrismaModule,
        UserModule,
        ManutenceModule
    ],
})

export class DatabaseModule {}