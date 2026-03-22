import { Injectable } from '@nestjs/common';
import { GetStandardResponseDto } from './dto/get-standard.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StandardService {

  async findAll(): Promise<GetStandardResponseDto> {
    const filePath = path.join(process.cwd(), 'data', 'standards.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const standards = JSON.parse(fileContent);

    const formattedData = standards.map((item: any) => ({
      ...item,
      createDate: new Date(item.createDate),
      standardName: item.name, // Map name to standardName as per DTO
    }));

    return { data: formattedData };
  }
}
