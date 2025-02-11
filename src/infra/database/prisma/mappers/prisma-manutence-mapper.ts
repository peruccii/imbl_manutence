import { Manutence as RawManutence, StatusManutence } from "@prisma/client";
import { verify } from "crypto";
import { Manutence } from "src/application/entities/manutence";
import { Message } from "src/application/fieldsValidations/message";

export class PrismaManutenceMapper {
    static toPrisma(manutence: Manutence) {
        return {
            id: manutence.id,
            message: manutence.message.value,
            photos: manutence.photos,
            video: manutence.video,
            status_manutence: manutence.status_manutence,
            createdAt: manutence.createdAt
        }
    }
    static toDomain(rawManutence: RawManutence): Manutence {
        return new Manutence(
            {
                message: new Message(rawManutence.message),
                video: rawManutence.video,
                photos: rawManutence.photos,
                status_manutence: rawManutence.status as StatusManutence,
                createdAt: rawManutence.createdAt
            },
            rawManutence.id
        )         
    }
}