import { UserRepository } from "../repositories/user-repository";

export class DeleteUserService {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string) {
        const userExists = this.userRepository.findOne(id)

        if (!userExists) throw new Error("user not found")

        return this.userRepository.delete(id)
    }
}