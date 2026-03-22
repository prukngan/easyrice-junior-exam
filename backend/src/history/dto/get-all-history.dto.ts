import { ApiProperty } from '@nestjs/swagger';
import { SamplingPoint } from '@prisma/client';
import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GetHistoryByFilterRequestDto {
    @ApiProperty({ required: false })
    @IsOptional()
    inspectionID?: string;

    @ApiProperty({ example: '2026-03-17T13:10:21.594Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startCreateDate?: Date;

    @ApiProperty({ example: '2026-03-17T13:10:21.594Z' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endCreateDate?: Date;

    @ApiProperty({ required: false, example: 1 })
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty({ required: false, example: 10 })
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
}

export class GetHistoryResponseDto {
    @ApiProperty({ example: 'ตรวจรับข้าวหอมมะลิ ล็อตที่ 001' })
    name: string;

    @ApiProperty({ example: '2026-03-19T20:11:53.517Z' })
    createdDate?: Date;

    @ApiProperty({ example: 'cmmxwovg30000ssdkbesks357' })
    inspectionID: string;

    @ApiProperty({ example: '1' })
    standardId?: string;

    @ApiProperty({ example: 'สุ่มตรวจจากท้ายรถบรรทุก' })
    note?: string;

    @ApiProperty({ example: 'ข้าวหอมมะลิ' })
    standardName?: string;

    @ApiProperty({ example: '2026-03-18T10:00:00.000Z' })
    samplingDate?: Date;

    @ApiProperty({
        enum: SamplingPoint,
        isArray: true,
        example: ['FRONT_END', 'BACK_END', 'OTHER'],
    })
    samplingPoints?: SamplingPoint[];

    @ApiProperty({ example: 15500 })
    price?: number
}

export class GetAllHistoryResponseDto {
    @ApiProperty({ type: [GetHistoryResponseDto] })
    data: GetHistoryResponseDto[];

    @ApiProperty({ example: 100 })
    totalHistory: number;
}