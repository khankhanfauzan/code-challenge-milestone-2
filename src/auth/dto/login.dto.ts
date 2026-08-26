import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: "email must be a valid email address" })
    @IsNotEmpty({ message: "email should not be empty" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "password should not be empty" })
    password: string;
}