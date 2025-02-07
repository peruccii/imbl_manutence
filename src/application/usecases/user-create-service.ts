import { Injectable } from "@nestjs/common";
import { makeUserFactory } from "../factories/user-factory";
import { CreateUserRequest } from "../interfaces/user-create-request";
import { PrismaUserMapper } from "src/infra/database/prisma/mappers/prisma-user-mapper";

@Injectable()
export class UserCreateService {
    constructor() {}

    async execute(request: CreateUserRequest) {
        const user = makeUserFactory({
            ...request
        })
        
        PrismaUserMapper.toPrisma(user)
    }
}