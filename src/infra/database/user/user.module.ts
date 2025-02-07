import { Module } from "@nestjs/common";
import { UserRepository } from "src/application/repositories/user-repository";
import { UserCreateService } from "src/application/usecases/user-create-service";

@Module({
    providers: [
        UserCreateService,
        {
            provide: UserRepository,
            useClass: UserCreateService
        }
    ],
    exports: [UserRepository]
})

export class UserModule {}