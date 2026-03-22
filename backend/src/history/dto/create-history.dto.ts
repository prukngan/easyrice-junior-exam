import {
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { Transform, Type } from 'class-transformer';
import { SamplingPoint } from '@prisma/client';
export { SamplingPoint };
import { Condition } from '../../standard/entities/standard.entity';

// Using SamplingPoint from @prisma/client directly

export class CreateHistoryRequestDto {
  @ApiProperty({ example: 'Sample Name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '1' })
  @IsString()
  standardID: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'raw.json file',
    required: false,
  })
  @IsOptional()
  rawData?: any;

  @ApiProperty({ required: false, example: 'Some notes' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, example: 100.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Max(100000)
  @Min(0)
  price?: number;

  @ApiProperty({
    enum: SamplingPoint,
    isArray: true,
    example: ['FRONT_END', 'BACK_END', 'OTHER'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return value;
  })
  samplingPoints?: SamplingPoint[];

  @ApiProperty({ required: false, example: '2026-03-17T09:58:51.690Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  samplingAt?: Date;
}

export class CreateHistoryResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Sample Name' })
  name: string;

  @ApiProperty({ example: '1' })
  standardID: string;

  @ApiProperty({ example: 100 })
  rawDataLNum: number;

  @ApiProperty({ required: false, example: 'Some notes' })
  note?: string;

  @ApiProperty({ required: false, example: 100.0 })
  price?: number;

  @ApiProperty({
    enum: SamplingPoint,
    isArray: true,
    example: ['FRONT_END', 'BACK_END', 'OTHER'],
  })
  samplingPoints?: SamplingPoint[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  totalSample?: number

  @ApiProperty({ required: false, example: '2026-03-17T09:58:51.690Z' })
  samplingAt?: Date;

  @ApiProperty({ required: false, example: '2026-03-17T09:58:51.690Z' })
  createAt?: Date;
}