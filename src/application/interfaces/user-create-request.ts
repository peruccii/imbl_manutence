import { userType } from "../enums/userType"

export interface CreateUserRequest {
    name: string
    telefone: string | null
    password: string
    email: string
    userType: userType.DEFAULT
}