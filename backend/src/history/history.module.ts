import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './history.repository';

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, HistoryRepository],
  exports: [HistoryRepository],
  imports: [],
})
export class HistoryModule { }
