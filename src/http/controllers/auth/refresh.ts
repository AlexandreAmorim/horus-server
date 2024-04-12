import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
    const token = await reply.jwtSign({
      sub: request.user.sub,
    })

    return reply.status(200).send({
      token,
    })
  } catch (err) {
    return reply
      .code(401)
      .send({ code: 'refreshtoken.invalid', message: 'Refresh token invalid.' })
  }
}
