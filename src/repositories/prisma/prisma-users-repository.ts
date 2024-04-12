import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export interface IPropsUserPermission {
  roles?: string[]
  permissions?: string[]
}

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByDocument(document: string) {
    const user = await prisma.user.findUnique({
      where: {
        document,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByRolesPermissions(id: string) {
    const rolesPermissions = await prisma.user.findFirst({
      select: {
        RoleUser: {
          select: {
            role: {
              select: {
                slug: true,
                PermissionRole: {
                  select: {
                    permissions: {
                      select: {
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id,
      },
    })

    if (!rolesPermissions) {
      return
    }

    const roles = rolesPermissions.RoleUser.map((u) => u.role.slug)

    const permissionsFlatten = rolesPermissions.RoleUser.map((user) =>
      user.role.PermissionRole.map((p) => p.permissions.slug),
    )

    const permissions = permissionsFlatten.reduce(
      (acc, cur) => [...acc, ...cur],
      [],
    )

    return { roles, permissions }
  }
}
