import { User } from "../entities/user"
import { makeManutenceFactory } from "../factories/manutence-factory"

export interface CreateManutenceRequest {
    message: string
    photos: string[]
    video: string
    client: User
}

export class ManutenceCreateService {
    constructor() {

    }

    async execute(request_manutence: CreateManutenceRequest) {
        const manutence = makeManutenceFactory({...request_manutence})
    }
}