import { IsOptional } from 'class-validator';

export class GetQueryDto{
    @IsOptional()
    from?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    title: string;

    @IsOptional()
    name: string;

    @IsOptional()
    status: string;

    @IsOptional()
    fromdate: Date;

    @IsOptional()
    todate: Date;

    @IsOptional()
    ispublish: string;

    @IsOptional()
    isactive: string;

    @IsOptional()
    sortingorder: any;
}