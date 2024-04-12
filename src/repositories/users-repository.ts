import { Prisma, User } from '@prisma/client'
import { IPropsUserPermission } from './prisma/prisma-users-repository'

export interface UsersRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByDocument(document: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
  findByRolesPermissions(id: string): Promise<IPropsUserPermission | undefined>
}
