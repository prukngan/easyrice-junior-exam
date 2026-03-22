import { ApiProperty } from '@nestjs/swagger';

export enum Condition {
  LT = 'LT',
  LE = 'LE',
  GT = 'GT',
  GE = 'GE',
}

export class SubStandard {
  @ApiProperty({ example: 'wholegrain' })
  key: string;

  @ApiProperty({ required: false, example: 'ข้าวเต็มเมล็ด' })
  name?: string;

  @ApiProperty({ example: 99 })
  maxLength: number;

  @ApiProperty({ example: 7 })
  minLength: number;

  @ApiProperty({ enum: Condition, example: Condition.GE })
  conditionMin: Condition;

  @ApiProperty({ enum: Condition, example: Condition.LE })
  conditionMax: Condition;
}

export class Standard {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ required: false, example: 'Standard Name' })
  name?: string;

  @ApiProperty({ example: '2023-10-27T10:00:00Z' })
  createDate: Date;

  @ApiProperty({ required: false, example: 'Thai Hom Mali' })
  standardName?: string;

  @ApiProperty({ example: { key: 'value' } })
  standardData: any;
}
