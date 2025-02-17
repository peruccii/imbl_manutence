import { Injectable } from "@nestjs/common";
import { ManutenceRepository } from "../repositories/manutence-repository";
import { Pagination } from "@application/interfaces/pagination";

@Injectable()
export class FindAllManutences {
    constructor(private readonly manutenceRepository: ManutenceRepository){}

    async execute(pagination: Pagination) {
        const manutences = await this.manutenceRepository.findMany(pagination)

        return { manutences }
    }
}