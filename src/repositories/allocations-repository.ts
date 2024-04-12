import { Allocation } from '@prisma/client'

export interface AllocationsRepository {
  findByUserAllocations(id: string): Promise<Allocation[] | []>
  findByAllocation(id: number): Promise<Allocation | null>
}
