import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '192.198.50.12',
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running!')
  })
