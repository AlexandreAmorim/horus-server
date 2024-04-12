import { FastifyInstance } from 'fastify'
import { register } from './register'
import { profile } from './profile'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/register', { onRequest: [verifyJwt] }, register)
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
