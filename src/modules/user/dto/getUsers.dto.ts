import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class GetUsersDto {
   
    @IsOptional()
    from: number;

    @IsOptional()
    @IsPositive()
    limit: number;
}
