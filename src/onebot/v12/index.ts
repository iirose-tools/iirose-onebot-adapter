import { EventEmitter } from "ws";
import { boardcast as ws_boardcast, globalEvent as ws_globalEvent } from "./server/ws";

export const boardcast = (data: any) => {
  ws_boardcast(data)
}

export const globalEvent = new EventEmitter()

ws_globalEvent.on('message', (data, emitter) => {
  globalEvent.emit('message', data, emitter)
})