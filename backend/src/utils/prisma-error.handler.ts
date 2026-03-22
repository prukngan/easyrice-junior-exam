// src/common/utils/prisma-error.handler.ts
import { 
  ConflictException, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint failed
        throw new ConflictException(`Unique constraint failed on field(s): ${(error.meta?.target as string[])?.join(', ')}`);
      case 'P2025':
        // Records not found (nested connect or delete)
        const cause = error.meta?.cause as string;
        throw new NotFoundException(cause || 'Record not found.');
      case 'P2003':
        // Foreign key constraint failed
        throw new BadRequestException('A related record was not found (Foreign key constraint).');
      case 'P2014':
        // The change you are trying to make would violate the required relation
        throw new BadRequestException('Relation violation (Required relation missing).');
      default:
        // Handle other known codes or throw generic error
        throw new BadRequestException(`Database Error (${error.code}): ${error.message}`);
    }
  }
  
  // If it's another type of error or unknown
  if (error instanceof Error) {
    throw new InternalServerErrorException(error.message);
  }

  throw new InternalServerErrorException('An unknown database error occurred.');
}
