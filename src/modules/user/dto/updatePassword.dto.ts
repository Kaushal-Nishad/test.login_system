import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class UpdatePasswordDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @MinLength(4)
    @IsNotEmpty()
    password: string;
}
