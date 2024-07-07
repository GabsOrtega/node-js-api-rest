// import { createServer } from 'node:http' // Importando uma biblioteca do node para criação de servidores http

// const server = createServer((request, response) => { // Criando um servidor com parametros request e response
//     response.write('oi')
//     return response.end()
// })

// server.listen(3333)

import { fastify } from 'fastify'
// import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()
// const database = new DatabaseMemory()
const database = new DatabasePostgres()

server.post('/videos', async (request, reply) => { // Uma rota de criação (CREATE)
    const { title, description, duration } = request.body

    await database.create({
        title: title,
        description: description,
        duration: duration,
    })

    return reply.status(201).send() // Algo foi criado com sucesso!
})

server.get('/videos', async (request, reply) => { // Rota de listagem (READ)
    const search = request.query.search
    console.log(search)

    const videos = await database.list(search)

    return videos
})

server.put('/videos/:id', async (request, reply) => { // Rota de Atualização (UPDATE)
    const videoId = request.params.id
    const { title, description, duration } = request.body

    const video = await database.update(videoId, {
        title,
        description,
        duration,
    })

    return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => { // Rota de exclusão (DELETE)
   const videoId = request.params.id

   await database.delete(videoId)

   return reply.status(204).send()
})

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
})
