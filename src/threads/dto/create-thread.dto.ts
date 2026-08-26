import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateThreadDto {

    @IsString()
    @IsNotEmpty({ message: "title should not be empty" })
    @MinLength(5)
    @MaxLength(200)
    title: string;


    @IsString()
    @IsNotEmpty({ message: "content should not be empty" })
    @MinLength(10)
    content: string;
}
