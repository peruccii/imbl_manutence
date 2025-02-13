import { Injectable } from "@nestjs/common";
import { ManutenceRepository } from "../repositories/manutence-repository";

@Injectable()
export class FindAllManutences {
    constructor(private readonly manutenceRepository: ManutenceRepository){}

    async execute() {
        const manutences = await this.manutenceRepository.findMany()

        return { manutences }
    }
}