import ws from 'ws'
import pako from 'pako'
import getLogger from '../../core/logger'
import EventEmitter from 'events'

interface IEmissions {
  open: () => void
  close: () => void
  error: (error: ws.ErrorEvent) => void
  message: (data: string) => void
}

export class WebSocket extends EventEmitter{
  private socket: ws
  private logger = getLogger('WebSocket')
  private _untypedOn = this.on
  private _untypedEmit = this.emit
  public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => this._untypedOn(event, listener)
  public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => this._untypedEmit(event, ...args)

  constructor (url: string) {
    super()
    this.socket = new ws(url)
  }

  private init () {
    this.socket.binaryType = 'arraybuffer'

    this.socket.onopen = () => this.openHandler()
    this.socket.onmessage = (data) => this.packetHandler(data)
    this.socket.onclose = () => this.closeHandler()
    this.socket.onerror = (err) => this.errorHandler(err)
  }

  private isOpen () {
    return this.socket.readyState === ws.OPEN
  }

  private openHandler () {
    this.logger.info('WebSocket connected')
    this.emit('open')
  }

  private packetHandler (data: ws.MessageEvent) {
    const arrayBuf = new Uint8Array(data.data as ArrayBuffer)

    this.logger.debug(`Received packet, length: ${arrayBuf.length}, type: ${arrayBuf[0] === 0 ? 'binary' : 'text'}`)

    // 压缩后的数据包
    if (arrayBuf[0] === 1) {
      const packet = pako.inflate(arrayBuf.slice(1))
      this.messageHandler(packet.toString())
    } else {
      this.messageHandler(arrayBuf.toString())
    }
  }

  private closeHandler () {
    this.emit('close')
    this.logger.info('WebSocket closed, reconnecting...')
    this.socket = new ws(this.socket.url)
    this.init()
  }

  private errorHandler (err: ws.ErrorEvent) {
    this.emit('error', err)
    this.logger.error(`WebSocket error: ${err.message}`)
  }

  private messageHandler (data: string) {
    this.emit('message', data)
  }
}