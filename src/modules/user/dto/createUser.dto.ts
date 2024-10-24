import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateUserDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    
    @IsString()
    @IsOptional()
    username: string;


    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    mobile: string;
    
    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsOptional()
    @MinLength(6)
    @MaxLength(6)
    pincode: string;


}
