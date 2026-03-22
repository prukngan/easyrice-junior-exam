import { ApiProperty } from "@nestjs/swagger";
import { Condition } from "../entities/standard.entity";

class StandardDataItemDto {
  @ApiProperty({ example: 'string' })
  key: string;

  @ApiProperty({ example: 0 })
  minLength: number;

  @ApiProperty({ example: 0 })
  maxLength: number;

  @ApiProperty({ type: [String], example: ['string'] })
  shape: string[];

  @ApiProperty({ example: 'string' })
  name: string;

  @ApiProperty({ enum: Condition, example: Condition.GE })
  conditionMin: Condition;

  @ApiProperty({ enum: Condition, example: Condition.GE })
  conditionMax: Condition;
}

class StandardDto {
  @ApiProperty({ example: 'string' })
  name: string;

  @ApiProperty({ example: 'string' })
  id: string;

  @ApiProperty({ example: '2026-03-17T10:42:04.031Z' })
  createDate: Date;

  @ApiProperty({ example: 'string' })
  standardName: string;

  @ApiProperty({ type: [StandardDataItemDto] })
  standardData: StandardDataItemDto[];
}

export class GetStandardResponseDto {
  @ApiProperty({ type: [StandardDto] })
  data: StandardDto[];
}