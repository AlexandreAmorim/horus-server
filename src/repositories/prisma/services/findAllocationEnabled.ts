import { Allocation } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const findAllocationEnabled = async (
  allocations: Allocation[],
): Promise<Allocation | boolean> => {
  if (!allocations) {
    return false
  }

  const allocationActivated = allocations.find(
    (allocation) => allocation.ended_at === null,
  )

  if (!allocationActivated) {
    return false
  }

  const allocation = await prisma.allocation.findUniqueOrThrow({
    where: {
      id: allocationActivated.id,
    },
  })
  return allocation
}

export { findAllocationEnabled }
