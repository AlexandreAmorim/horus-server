import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/authenticate/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    document: z.string({
      required_error: 'Document is required',
      invalid_type_error: 'Document must be a string',
    }),
    password: z.string().min(6),
  })

  try {
    const { document, password } = await new ZodValidationPipe(
      authenticateBodySchema,
    ).transform(request.body, reply)

    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      document,
      password,
    })

    const token = await reply.jwtSign({
      sub: user.id,
    })

    const refresh_token = await reply.jwtSign(
      {
        sub: user.id,
      },
      { expiresIn: '3m' },
    )

    return reply.status(200).send({
      user,
      token,
      refresh_token,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
