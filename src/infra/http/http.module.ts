import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ManutenceController } from "./controllers/manutence.controller";
import { UserController } from "./controllers/user.controller";
import { UserCreateService } from "src/application/usecases/user-create-service";
import { ManutenceCreateService } from "src/application/usecases/manutence-create-service";
import { RolesGuard } from "src/application/guards/role.guards";
import { APP_GUARD } from "@nestjs/core";

@Module({
    imports: [
      DatabaseModule,
      //ConfigModule.forRoot({
        //isGlobal: true,
        //envFilePath: 'env',
      //}),
    ],
    controllers: [ManutenceController, UserController],
    providers: [
     UserCreateService,
     ManutenceCreateService,
     {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    ],
  })
  export class HttpModule {}