import { IsEmail, IsIn, IsNotEmpty } from "class-validator"
import { DtoManutenceUserTypeMessage } from "src/application/messages/dto/dto-manutence-role"

export class CreateUserDTO {
    @IsNotEmpty()
    name: string
    telefone: string | null
    @IsNotEmpty({message: 'password must be not empty'})
    password: string
    @IsEmail()
    email: string
    @IsIn(['ADMIN', 'DEFAULT'], { message: DtoManutenceUserTypeMessage })
    userType: 'ADMIN' | 'DEFAULT';
}