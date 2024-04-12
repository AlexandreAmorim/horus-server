import { prisma } from '@/lib/prisma'

import { AllocationsRepository } from '../allocations-repository'

export class PrismaAllocationsRepository implements AllocationsRepository {
  async findByUserAllocations(id: string) {
    const allocations = await prisma.allocation.findMany({
      where: {
        user_id: id,
      },
    })
    return allocations
  }

  async findByAllocation(id: number) {
    const allocation = await prisma.allocation.findUnique({
      where: {
        id,
      },
    })

    return allocation
  }
}
