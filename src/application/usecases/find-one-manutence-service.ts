import { ManutenceNotFoundError } from "../errors/manutence-not-found.error";
import { ManutenceNotFoundMessage } from "../messages/manutence-not-found";
import { ManutenceRepository } from "../repositories/manutence-repository";

export interface FindOneManutenceRequest {
    id: string
}

export class FindOneManutenceService {
    constructor(private readonly manutenceRepository: ManutenceRepository) {}

    async execute(request: FindOneManutenceRequest) {
        const { id } = request
        const manutence = await this.manutenceRepository.find(id)

        if (!manutence) {
            throw new ManutenceNotFoundError(ManutenceNotFoundMessage);
        }

        return { manutence }
    }
}