import { Setting } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const findSettingsVersion = async (): Promise<Setting | null> => {
  const setting = await prisma.setting.findFirst()
  return setting
}

export { findSettingsVersion }
