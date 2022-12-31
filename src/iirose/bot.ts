import packets from "./packets";
import { WebSocket } from "./network";
import { EventEmitter } from "ws";

import { SystemMessage as JoinRoom } from "./packets/decoders/JoinRoom";
import { SystemMessage as LeaveRoom } from "./packets/decoders/LeaveRoom";
import { SwitchRoom } from "./packets/decoders/SwitchRoom";
import { PrivateMessage } from "./packets/decoders/PrivateMessage";
import { PublicMessage } from "./packets/decoders/PublicMessage";

interface IEmissions {
  JoinRoom: (data: JoinRoom) => void;
  LeaveRoom: (data: LeaveRoom) => void;
  SwitchRoom: (data: SwitchRoom) => void;
  PrivateMessage: (data: PrivateMessage) => void;
  PublicMessage: (data: PublicMessage) => void;
}

export interface Config {
  account: {
    username: string;
    password: string;
  },
  enableRoomEvents: boolean;
  enablePrivateEvents: boolean;
}

export default class Bot extends EventEmitter {
  private ws: WebSocket;
  private config: any // TODO: types
  private _untypedOn = this.on
  private _untypedEmit = this.emit
  public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => this._untypedOn(event, listener)
  public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => this._untypedEmit(event, ...args)

  constructor(config: any) {
    super()

    this.config = config;
    this.ws = new WebSocket('wss://m2.iirose.com:8778');

    this.ws.on('message', packet => {
      this.handlePacket(packet);
    })
  }

  /**
   * @description Handles a packet
   * @param packet The packet to handle
   */
  private handlePacket(packet: string) {
    const data = packets.decode(packet);

    if (!data || data.length <= 0) return

    for (const pack of data) {
      const [type, data]: any = pack;

      this.emit(type, data);
    }
  }

  public sendPrivateMessage(uid: string, message: string) {
    const succ = this.ws.send(packets.encode.PrivateMessage(uid, message, this.config.color));
    if (!succ) throw new Error('Failed to send private message');
  }

  public sendPublicMessage(message: string) {
    const succ = this.ws.send(packets.encode.PublicMessage(message, this.config.color));
    if (!succ) throw new Error('Failed to send public message');
  }
}