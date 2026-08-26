import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {

    @IsString()
    @IsNotEmpty({ message: "username should not be empty" })
    @MinLength(3)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username may only contain letters, numbers, and underscores' })
    username: string;


    @IsEmail({}, { message: "email must be a valid email address" })
    @IsNotEmpty({ message: "email should not be empty" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "password should not be empty" })
    @MinLength(6, { message: "password must be at least 6 character" })
    password: string;
}
