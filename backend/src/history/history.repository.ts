import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Inspection, CompositionResult, DefectResult, RawRice, Standard, SubStandard, Prisma, SamplingPoint } from '@prisma/client';
import { handlePrismaError } from '../utils/prisma-error.handler';

@Injectable()
export class HistoryRepository {
  constructor(private prisma: PrismaService) { }

  async createInspection(
    data: Prisma.InspectionCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Inspection> {
    const client = tx || this.prisma;

    try {
      return await client.inspection.create({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async incrementCounter(
    name: string,
    tx: Prisma.TransactionClient
  ) {
    return tx.counter.upsert({
      where: { name },
      update: { lastValue: { increment: 1 } },
      create: { name, lastValue: 1 },
    });
  }

  async createManyRawRice(data: Prisma.RawRiceCreateManyInput[]): Promise<any> {
    try {
      return await this.prisma.rawRice.createMany({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async createManyCompositionResult(data: Prisma.CompositionResultCreateManyInput[]): Promise<any> {
    try {
      return await this.prisma.compositionResult.createMany({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async createManyDefectResult(data: Prisma.DefectResultCreateManyInput[]): Promise<any> {
    try {
      return await this.prisma.defectResult.createMany({
        data,
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findStandardById(id: string): Promise<(Standard & { standardData: SubStandard[] }) | null> {
    try {
      return await this.prisma.standard.findUnique({
        where: { id },
        include: {
          standardData: true,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findManyInspections(filters: {
    inspectionID?: string;
    startCreateDate?: Date;
    endCreateDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ data: (Inspection & { standard: Standard })[]; total: number }> {
    const { inspectionID, startCreateDate, endCreateDate, page = 1, limit = 10 } = filters;
    const numericPage = Number(page);
    const numericLimit = Number(limit);
    const skip = (numericPage - 1) * numericLimit;

    // สร้างเงื่อนไข Where แบบ Dynamic
    const where: Prisma.InspectionWhereInput = {};

    if (inspectionID) {
      where.id = { contains: inspectionID, mode: 'insensitive' };
    }

    if (startCreateDate || endCreateDate) {
      where.createdAt = {
        gte: startCreateDate,
        lte: endCreateDate,
      };
    }

    try {
      const [data, total] = await Promise.all([
        this.prisma.inspection.findMany({
          where,
          skip: skip,
          take: numericLimit,
          include: { standard: true },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.inspection.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async findInspectionById(id: string) {
    try {
      const inspection = await this.prisma.inspection.findUnique({
        where: { id },
        include: {
          standard: true,
          compositions: true,
          defects: true,
        },
      });

      return inspection;
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateInspection(
    inspectionID: string,
    note?: string,
    price?: number,
    samplingDate?: Date,
    samplingPoints?: SamplingPoint[],
  ): Promise<Inspection> {
    try {
      return await this.prisma.inspection.update({
        where: { id: inspectionID },
        data: {
          note,
          price,
          samplingAt: samplingDate,
          samplingPoints,
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteInspection(inspectionIDs: string[]): Promise<Prisma.BatchPayload> {
    try {
      if (!inspectionIDs || inspectionIDs.length === 0) {
        return { count: 0 };
      }

      return await this.prisma.inspection.deleteMany({
        where: { id: { in: inspectionIDs } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  }
}
