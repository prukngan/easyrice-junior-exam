import { ApiProperty } from "@nestjs/swagger";
import { SamplingPoint } from "@prisma/client";

class Standard {
    standardId: string;
    standardName: string;
}

class CompositionResult {
    subStandardName: string;
    minLength: number;
    maxLength: number;
    conditionMin: string;
    conditionMax: string;
    weightGrams: number;
    percentage: number;
}

class DefectResult {
    type: string;
    weightGrams: number;
    percentage: number;
}

export class GetOneHistoryResponseDto {
    @ApiProperty({ example: 'ตรวจรับข้าวหอมมะลิ ล็อตที่ 001' })
    name: string;

    @ApiProperty({ example: '2026-03-19T20:11:53.517Z' })
    createdDate?: Date;

    @ApiProperty({ example: 'cmmxwovg30000ssdkbesks357' })
    inspectionID: string;

    @ApiProperty({ example: '1' })
    standard?: Standard;

    @ApiProperty({ type: [CompositionResult] })
    compositionResult?: CompositionResult[];

    @ApiProperty({ type: [DefectResult] })
    defectResult?: DefectResult[];

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

    @ApiProperty({ example: 100 })
    totalSample?: number;

    @ApiProperty({ example: 15500 })
    price?: number
}