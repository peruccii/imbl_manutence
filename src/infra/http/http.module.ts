import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { ManutenceController } from "./controllers/manutence.controller";
import { UserController } from "./controllers/user.controller";
import { UserCreateService } from "src/application/usecases/user-create-service";
import { ManutenceCreateService } from "src/application/usecases/manutence-create-service";

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
     ManutenceCreateService
    ],
  })
  export class HttpModule {}