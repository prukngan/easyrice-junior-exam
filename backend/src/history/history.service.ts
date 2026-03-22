import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHistoryRequestDto, CreateHistoryResponseDto, SamplingPoint } from './dto/create-history.dto';
import { HistoryRepository } from './history.repository';
import { calculateCompositionResults } from './utils/compoitionCalculate'
import { calculateDefectResults } from './utils/defectCalculate'
import { PrismaService } from 'src/prisma.service';
import { GetAllHistoryResponseDto, GetHistoryByFilterRequestDto } from './dto/get-all-history.dto';
import { GetOneHistoryResponseDto } from './dto/get-one-history.dto';
import { UpdateHistoryRequestDto, UpdateHistoryResponseDto } from './dto/update-history.dto'
import { DeleteHistoryRequestDto, DeleteHistoryResponseDto } from './dto/delete-history.dto'

@Injectable()
export class HistoryService {
  constructor(
    private repository: HistoryRepository,
    private prisma: PrismaService
  ) { }

  async create(dto: CreateHistoryRequestDto): Promise<CreateHistoryResponseDto> {
    // 1. ตรวจสอบ Standard ก่อนเซฟลง Database เพื่อป้องกันขยะ (Dirty Data) 
    const standard = await this.repository.findStandardById(dto.standardID);
    if (!standard) {
      throw new Error('Standard not found');
    }

    const subStandard = standard.standardData;
    if (!subStandard) {
      throw new Error('Sub standard not found');
    }

    // 2. อ่านและเตรียมข้อมูล Grains
    const rawDataContent = dto.rawData?.buffer ? JSON.parse(dto.rawData.buffer.toString()) : null;
    const grains = rawDataContent?.grains || [];

    // 3. คำนวณ Composition และ Defect ให้เสร็จสิ้นก่อน
    const compositionResults = calculateCompositionResults(grains, standard);
    const { percentageEachType, totalWeight, totalDefectWeight } = calculateDefectResults(grains);

    // 4. บันทึกข้อมูลทั้งหมดใน Query เดียว (Nested Writes + Transaction ในตัว)
    // การทำ Nested writes ช่วยรับประกันความถูกต้อง (Atomicity) และลดโหลดของ Database
    const inspectionResult = await this.prisma.$transaction(async (tx) => {

      const counter = await this.repository.incrementCounter('inspection_EC', tx);
      const customId = `EC-${Math.floor(counter.lastValue / 1000).toString().padStart(3, '0')}-${(counter.lastValue % 1000).toString().padStart(4, '0')}`;

      return await this.repository.createInspection({
        id: customId,
        name: dto.name,
        standard: { connect: { id: dto.standardID } },
        note: dto.note,
        price: (dto.price !== undefined && dto.price !== null) ? Number(dto.price) : null,
        samplingAt: dto.samplingAt ? new Date(dto.samplingAt) : null,
        samplingPoints: Array.isArray(dto.samplingPoints)
          ? dto.samplingPoints.map(s => s.trim().toUpperCase().replace(/\s+/g, '_') as SamplingPoint)
          : typeof dto.samplingPoints === 'string'
            ? (dto.samplingPoints as string).split(',').map(s => s.trim().toUpperCase().replace(/\s+/g, '_') as SamplingPoint)
            : [],
        totalSample: grains.length,
        totalWeight,
        totalDefectWeight,
        ...(grains.length > 0 && {
          rawRices: {
            createMany: {
              data: grains.map((grain: any) => ({
                length: grain.length,
                weight: grain.weight,
                shape: grain.shape,
                type: grain.type,
              }))
            }
          }
        }),
        ...(compositionResults.length > 0 && {
          compositions: {
            createMany: {
              data: compositionResults.map((composition: any) => ({
                subStandardKey: composition.subStandardKey,
                subStandardName: composition.subStandardName,
                minLength: composition.minLength,
                maxLength: composition.maxLength,
                conditionMin: composition.conditionMin,
                conditionMax: composition.conditionMax,
                weightGrams: composition.weightGrams,
                percentage: composition.percentage,
              }))
            }
          }
        }),
        ...(percentageEachType.length > 0 && {
          defects: {
            createMany: {
              data: percentageEachType.map((defect: any) => ({
                type: defect.type,
                weightGrams: defect.weightGrams,
                percentage: defect.percentage,
              }))
            }
          }
        })
      }, tx);
    });

    return {
      id: inspectionResult.id,
      name: inspectionResult.name,
      standardID: inspectionResult.standardId,
      rawDataLNum: grains.length,
      note: inspectionResult.note ?? undefined,
      price: inspectionResult.price ? Number(inspectionResult.price) : undefined,
      totalSample: inspectionResult.totalSample ?? undefined,
      samplingPoints: inspectionResult.samplingPoints,
      samplingAt: inspectionResult.samplingAt ?? undefined,
      createAt: inspectionResult.createdAt,
    };
  }

  async findAll(query: GetHistoryByFilterRequestDto): Promise<GetAllHistoryResponseDto> {
    const { data, total } = await this.repository.findManyInspections(query);

    return {
      data: data.map((inspection) => ({
        name: inspection.name,
        createdDate: inspection.createdAt,
        inspectionID: inspection.id,
        standardId: inspection.standardId,
        note: inspection.note ?? undefined,
        standardName: inspection.standard.name,
        samplingDate: inspection.samplingAt ?? undefined,
        samplingPoints: inspection.samplingPoints,
        price: inspection.price ? Number(inspection.price) : undefined,
      })),
      totalHistory: total,
    };
  }

  async findOne(inspectionId: string): Promise<GetOneHistoryResponseDto> {
    const inspection = await this.repository.findInspectionById(inspectionId);

    if (!inspection) {
      throw new BadRequestException('Inspection not found');
    }

    return {
      name: inspection.name,
      createdDate: inspection.createdAt,
      inspectionID: inspection.id,
      standard: {
        standardId: inspection.standardId,
        standardName: inspection.standard.name,
      },
      compositionResult: inspection.compositions.map((c: any) => ({
        subStandardName: c.subStandardName,
        minLength: c.minLength,
        maxLength: c.maxLength,
        conditionMin: c.conditionMin,
        conditionMax: c.conditionMax,
        weightGrams: c.weightGrams,
        percentage: c.percentage,
      })),
      defectResult: inspection.defects.map((d: any) => ({
        type: d.type,
        weightGrams: d.weightGrams,
        percentage: d.percentage,
      })),
      note: inspection.note ?? undefined,
      standardName: inspection.standard.name,
      samplingDate: inspection.samplingAt ?? undefined,
      samplingPoints: inspection.samplingPoints ?? undefined,
      totalSample: inspection.totalSample ?? undefined,
      price: inspection.price ? Number(inspection.price) : undefined,
    };
  }

  async update(id: string, dto: UpdateHistoryRequestDto): Promise<UpdateHistoryResponseDto> {
    if (!dto) {
      throw new BadRequestException('update body is missing')
    }

    const normalizedSamplingPoints = (dto.samplingPoints || []).map(s =>
      s.trim().toUpperCase().replace(/\s+/g, '_') as SamplingPoint
    );

    const updated = await this.repository.updateInspection(
      id,
      dto.note,
      dto.price,
      dto.samplingDate,
      normalizedSamplingPoints,
    );

    return {
      name: updated.name,
      createdDate: updated.createdAt,
      inspectionID: updated.id,
      standardId: updated.standardId,
      note: updated.note ?? undefined,
      samplingDate: updated.samplingAt ?? undefined,
      samplingPoints: updated.samplingPoints,
      price: (updated.price !== undefined && updated.price !== null) ? Number(updated.price) : undefined,
    };
  }

  async remove(dto: DeleteHistoryRequestDto): Promise<DeleteHistoryResponseDto> {
    const count = await this.repository.deleteInspection(dto.inspectionID);

    if (count.count === 0) {
      throw new BadRequestException('Inspection not found');
    }

    return {
      message: 'Delete successfully',
      inspectionID: dto.inspectionID,
    };
  }
}
