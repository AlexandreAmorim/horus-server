import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { ZodError } from 'zod'
import { env } from '@/env'
import { usersRoutes } from '@/http/controllers/users/routes'
import { authRoutes } from '@/http/controllers/auth/routes'

export const app = fastify()

app.register(cors)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1m',
  },
})

app.get('/', async function handler() {
  const data = new Date()
  return { hello: 'world', data }
})

app.register(fastifyCookie)
app.register(usersRoutes)
app.register(authRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
