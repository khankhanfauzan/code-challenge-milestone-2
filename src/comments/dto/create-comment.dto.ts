import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty({ message: "Content should not be empty" })
    @MinLength(1)
    content: string;
}
