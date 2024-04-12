import { FastifyReply } from 'fastify'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, reply: FastifyReply) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        reply.status(400).send({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      reply.status(400).send('Validation failed')
    }
    return value
  }
}
