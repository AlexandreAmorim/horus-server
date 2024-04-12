import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaAllocationsRepository } from '@/repositories/prisma/prisma-allocations-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const allocationsRepository = new PrismaAllocationsRepository()
  const authenticateUseCase = new AuthenticateUseCase(
    usersRepository,
    allocationsRepository,
  )

  return authenticateUseCase
}
