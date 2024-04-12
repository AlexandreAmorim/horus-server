import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsEmailError } from '@/use-cases/errors/users/user-already-exists-email-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { UserAlreadyExistsDocumentError } from '@/use-cases/errors/users/user-already-exists-document-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    first_name: z.string(),
    last_name: z.string().nullable().default(null),
    document: z.string(),
    document_secondary: z.string().nullable().default(null),
    rg: z.string().nullable().default(null),
    email: z.string().email(),
    phone: z.string().nullable().default(null),
    gender: z.string().nullable().default(null),
    birthday: z.coerce.date().nullable().default(null),
    avatar: z.string().nullable().default(null),
    is_intelligence: z.boolean().default(false),
    status: z.boolean().default(true),
  })

  const data = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const { user } = await registerUseCase.execute(data)
    return reply.status(201).send({ message: { id: user.id } })
  } catch (err) {
    if (err instanceof UserAlreadyExistsEmailError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof UserAlreadyExistsDocumentError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
