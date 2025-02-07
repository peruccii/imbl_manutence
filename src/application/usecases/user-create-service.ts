import { Injectable } from "@nestjs/common";
import { makeUserFactory } from "../factories/user-factory";
import { CreateUserRequest } from "../interfaces/user-create-request";
import { PrismaUserMapper } from "src/infra/database/prisma/mappers/prisma-user-mapper";
import { UserRepository } from "../repositories/user-repository";

@Injectable()
export class UserCreateService {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(request: CreateUserRequest) {

        const userExists = await this.userRepository.findOne(request.email)

        if (userExists) throw new Error("user already exists")

        const user = makeUserFactory({
            ...request
        })

        PrismaUserMapper.toPrisma(user)
    }
}