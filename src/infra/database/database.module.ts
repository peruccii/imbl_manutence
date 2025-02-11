import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ManutenceModule } from "./manutence/manutence.module";

@Module({
    imports: [
        //ConfigModule.forRoot({
        //    isGlobal: true,
        //    envFilePath: '.env',
//}),
        //PrismaModule,
        UserModule,
        ManutenceModule
    ],
    exports: [
       // PrismaModule,
        UserModule,
        ManutenceModule
    ],
})

export class DatabaseModule {}