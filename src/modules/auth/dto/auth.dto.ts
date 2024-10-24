import { MinLength, IsNotEmpty, IsEmail, length, MaxLength, IsOptional } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class LoginDto {
    @MinLength(6)
    @IsNotEmpty()
    @IsEmail()
    username: string;

    @MinLength(8)
    @IsNotEmpty()
    password: string;
}


export class RegisterDTO {
    
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    @MinLength(10)
    @MaxLength(10)
    mobile: string;

    @MinLength(6)
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @MinLength(8)
    @IsNotEmpty()
    password: string;

    refreshToken?: string;
}
export class UpdateRegisterDTO {

    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
  
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    @MinLength(10)
    @MaxLength(10)
    mobile: string;

    @MinLength(6)
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
export class ChangePasswordDto {
    @IsOptional()
    id: MongooseSchema.Types.ObjectId;
    
    @IsNotEmpty()
    oldpassword: string;

    @MinLength(8)
    @IsNotEmpty()
    password: string;
}
export class RefereshTokenDto {
    @IsNotEmpty()
    refereshtoken: string;
}
