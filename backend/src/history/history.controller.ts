import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HistoryService } from './history.service';
import { CreateHistoryRequestDto, CreateHistoryResponseDto } from './dto/create-history.dto';
import { GetHistoryByFilterRequestDto } from './dto/get-all-history.dto'
import { UpdateHistoryRequestDto } from './dto/update-history.dto'
import { DeleteHistoryRequestDto } from './dto/delete-history.dto'

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('rawData'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a history record' })
  @ApiResponse({ status: 201, description: 'The history record has been successfully created.', type: CreateHistoryResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(
    @Body() dto: CreateHistoryRequestDto,
    @UploadedFile() file: any,
  ): Promise<CreateHistoryResponseDto> {
    if (file) {
      dto.rawData = file;
    }
    return this.historyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all history records' })
  @ApiResponse({ status: 200, description: 'Return all history records.' })
  findAll(
    @Query() query: GetHistoryByFilterRequestDto
  ) {
    return this.historyService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a history record by ID' })
  @ApiParam({ name: 'id', description: 'History ID' })
  @ApiResponse({ status: 200, description: 'Return the history record.' })
  @ApiResponse({ status: 404, description: 'History record not found.' })
  findOne(
    @Param('id') inspectionId: string,
  ) {
    return this.historyService.findOne(inspectionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a history record' })
  @ApiParam({ name: 'id', description: 'History ID' })
  @ApiResponse({ status: 200, description: 'The history record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'History record not found.' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHistoryRequestDto
  ) {
    return this.historyService.update(id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a history record' })
  @ApiResponse({ status: 200, description: 'The history record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'History record not found.' })
  remove(@Body() dto: DeleteHistoryRequestDto) {
    console.log(dto)
    return this.historyService.remove(dto);
  }
}
