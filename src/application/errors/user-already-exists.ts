import { HttpException, HttpStatus } from "@nestjs/common";
import { DefaultSetupError } from "./default-setup";

export class UserAlreadyExists extends DefaultSetupError {
    constructor(message: string) {
        super(message);
        this.httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
    }

    error() {
        throw new HttpException({
            status: this.httpStatus,
            error: this.message,
        }, this.httpStatus);
    }
}
