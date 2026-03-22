import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";

export class DeleteHistoryRequestDto {
    @ApiProperty({ example: ["cmmxwlqak0000p8dkvngiod2h", "cmmxwovg30000ssdkbesks357"] })
    @IsArray()
    @IsString({ each: true })
    inspectionID: string[];
}

export class DeleteHistoryResponseDto {
    @ApiProperty({ example: "Delete successfully" })
    message: string;

    @ApiProperty({ example: ["cmmxwlqak0000p8dkvngiod2h", "cmmxwovg30000ssdkbesks357"] })
    inspectionID: string[];
}