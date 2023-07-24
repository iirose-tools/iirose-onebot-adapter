import { Server, WebSocket } from 'ws'
import { getConfig } from '../../../core/config'
import { EventEmitter } from 'ws'
import id from '../../../core/id'
import { version } from '../../../core/version'
import { getLogger } from 'log4js'

const server = new Server({
  port: getConfig('server.v12.ws.port'),
  host: getConfig('server.v12.ws.host'),
})

export const globalEvent = new EventEmitter()
export const boardcast = (data: any) => {
  server.clients.forEach((client) => {
    client.send(data)
  })
}

export const createCallbackEmitter = (socket: WebSocket) => {
  const emitter = (status: 'ok' | 'failed', retcode: number, data?: any, message?: string, echo?: any) => {
    socket.send(JSON.stringify({
      status,
      retcode,
      data,
      message,
      echo
    }))
  }

  return emitter
}

export const createEventPusher = (socket: WebSocket) => {
  const pusher = (type: string, detail_type: string, sub_type: string, data: any) => {
    socket.send(JSON.stringify({
      id: id(),
      time: Date.now() / 1000,
      type,
      detail_type,
      sub_type,
      self: getConfig('compatibility.events.self'),
      ...data
    }))
  }

  return pusher
}

server.on('connection', (client, req) => {
  const headers = req.headers
  const url = new URL(req.url || '', `ws://${headers.host}`)
  const header_token = headers['authorization']
  const query_token = url.searchParams.get('access_token')

  const token = getConfig('server.v12.ws.access_token')

  if (header_token !== `Bearer ${token}` && query_token !== token) {
    client.close(1008, 'Invalid access token')
    return
  }

  const pusher = createEventPusher(client)
  
  pusher('meta', 'connect', "", {
    version: {
      impl: "iirose-onebot-adapter",
      version: `onebot-v12-adapter/${version}`,
      onebot_version: "12"
    }
  })

  client.on('message', (data) => {
    const emitter = createCallbackEmitter(client)
    globalEvent.emit('message', data, emitter)
  })

  // 心跳包
  if (getConfig("server.v12.ws.heartbeat.enable")) {
    const interval = getConfig("server.v12.ws.heartbeat.interval")

    const timer = setInterval(() => {
      pusher('meta', 'heartbeat', '', { interval })
    }, interval)

    // 客户端关闭连接时清除定时器
    client.on('close', () => {
      clearInterval(timer)
    })
  }

  client.on('error', (err) => {
    getLogger('OneBot[v12][WS]').error(err)
  })
})