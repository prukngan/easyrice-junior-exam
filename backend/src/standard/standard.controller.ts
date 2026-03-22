import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StandardService } from './standard.service';
import { GetStandardResponseDto } from './dto/get-standard.dto';
import { Standard } from './entities/standard.entity';

@ApiTags('standard')
@Controller('standard')
export class StandardController {
  constructor(private readonly standardService: StandardService) { }

  @Get()
  @ApiOperation({ summary: 'Get all standards' })
  @ApiResponse({ status: 200, description: 'Return all standards.', type: GetStandardResponseDto })
  findAll(): Promise<GetStandardResponseDto> {
    return this.standardService.findAll();
  }
}
