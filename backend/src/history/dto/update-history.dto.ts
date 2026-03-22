import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SamplingPoint } from '@prisma/client';
import { IsOptional, IsDate, IsNumber, IsString, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { CreateHistoryRequestDto } from './create-history.dto';
import { GetHistoryResponseDto } from './get-all-history.dto';

export class UpdateHistoryRequestDto {
    @ApiProperty({ example: 'สุ่มตรวจจากท้ายรถบรรทุก' })
    @IsOptional()
    @IsString()
    note?: string;

    @ApiProperty({ example: 15500 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    price?: number

    @ApiProperty({ example: '2026-03-18T10:00:00.000Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    samplingDate?: Date;

    @ApiProperty({ example: ['FRONT_END'] })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',').map(v => v.trim());
        return value;
    })
    samplingPoints?: SamplingPoint[];
}

export class UpdateHistoryResponseDto extends PartialType(GetHistoryResponseDto) { }
