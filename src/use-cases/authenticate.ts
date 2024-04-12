import { UsersRepository } from '@/repositories/users-repository'
import { AllocationsRepository } from '@/repositories/allocations-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/authenticate/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { findAllocationEnabled } from '../repositories/prisma/services/findAllocationEnabled'
import { findSettingsVersion } from '../repositories/prisma/services/findSettingsVersion'

interface AuthenticateUseCaseRequest {
  document: string
  password: string
}

interface IAllocation {
  ended_at: Date
  management_id: number
  started_at: Date
}

interface IResponse {
  id: string
  email: string
  name: string
  avatar?: string
  first_name: string
  is_intelligence: boolean | null
  allocation?: IAllocation | null | boolean
  roles?: string[]
  permissions?: string[]
  spa_version?: string | null
}

interface AuthenticateUseCaseResponse {
  user: IResponse
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private allocationsRepository: AllocationsRepository,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByDocument(document)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(password, user.password)

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    const reponse = await this.usersRepository.findByRolesPermissions(user.id)

    const allocations = await this.allocationsRepository.findByUserAllocations(
      user.id,
    )

    const allocation = await findAllocationEnabled(allocations)
    const setting = await findSettingsVersion()

    return {
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        is_intelligence: user.is_intelligence,
        roles: reponse?.roles,
        allocation: allocation
          ? {
              ended_at: allocation.ended_at,
              management_id: allocation.management_id,
              started_at: allocation.started_at,
            }
          : null,
        permissions: reponse?.permissions,
        spa_version: setting?.version,
      },
    }
  }
}
