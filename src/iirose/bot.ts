import packets from "./packets";
import { WebSocket } from "./network";
import { EventEmitter } from "events";

import { SystemMessage as JoinRoom } from "./packets/decoders/JoinRoom";
import { SystemMessage as LeaveRoom } from "./packets/decoders/LeaveRoom";
import { SwitchRoom } from "./packets/decoders/SwitchRoom";
import { PrivateMessage } from "./packets/decoders/PrivateMessage";
import { PublicMessage } from "./packets/decoders/PublicMessage";

import logger from "../core/logger";
import { UserProfileCallback } from "./packets/decoders/ProfileCallback";

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

export interface Account {
  username: string,
  password: string,
  room: string,
  color: string
}

export default class Bot extends EventEmitter {
  private ws?: WebSocket;
  // @ts-ignore
  private _untypedOn = this.on
  // @ts-ignore
  private _untypedEmit = this.emit
  public on = <K extends keyof IEmissions>(event: K, listener: IEmissions[K]): this => this._untypedOn(event, listener)
  public emit = <K extends keyof IEmissions>(event: K, ...args: Parameters<IEmissions[K]>): boolean => this._untypedEmit(event, ...args)

  public account: Account;
  public online: boolean = false;
  public index: number = -1;

  constructor(account: Account) {
    super()
    
    this.account = account;

    this.init()
  }

  init () {
    logger(`IIROSE[${this.account.username}]`).info('正在连接服务器...')
    this.ws = new WebSocket('wss://m2.iirose.com:8778');

    this.ws.on('message', packet => {
      this.handlePacket(packet);
    })

    this.login()

    this.ws.once('close', () => {
      this.online = false
      logger(`IIROSE[${this.account.username}]`).info('与服务器断开连接, 5秒后重连')

      setTimeout(() => {
        logger(`IIROSE[${this.account.username}]`).info('正在重连...')
        this.init()
      }, 5000)
    })
  }

  login () {
    if (!this.ws) return

    // 处理登录
    this.ws.on('open', () => {
      if (!this.ws) return
      logger(`IIROSE[${this.account.username}]`).info('已连接服务器, 正在登录...')
      this.ws.send(packets.encode.Login(this.account.username, this.account.password, this.account.room));
      this.ws.once('message', packet => {
        if (packet === '%*"2') {
          logger(`IIROSE[${this.account.username}]`).fatal('登录失败，密码错误')
        } else if (packet === '%*"1') {
          logger(`IIROSE[${this.account.username}]`).fatal('登录失败，用户不存在')
        } else if (packet === '%*"0') {
          logger(`IIROSE[${this.account.username}]`).fatal('登录失败，此名字已被占用')
        } else {
          logger(`IIROSE[${this.account.username}]`).info('收到服务器返回数据, 登录成功')
          this.online = true
        }
      })
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

  public sendPrivateMessage(uid: string, message: string, id: string) {
    if (!this.ws) return
    const succ = this.ws.send(packets.encode.PrivateMessage(uid, message, this.account.color, id));
    if (!succ) throw new Error('Failed to send private message');
  }

  public sendPublicMessage(message: string, id: string) {
    if (!this.ws) return
    const succ = this.ws.send(packets.encode.PublicMessage(message, this.account.color, id));
    if (!succ) throw new Error('Failed to send public message');
  }

  public deleteMessage (id: string) {
    if (!this.ws) return
    const succ = this.ws.send(packets.encode.DeleteMessage(id));
    if (!succ) throw new Error('Failed to delete message');
  }

  private callApiWithCallback (data: string, eventName: string) {
    return new Promise((resolve, reject) => {
      if (!this.ws) return
      let end = false
      const timeout = setTimeout(() => {
        reject('timeout')
      }, 5000)

      this.once(eventName, (data: any) => {
        if (end) return
        resolve(data)

        end = true
        clearTimeout(timeout)
      })

      this.ws.send(data)
    })
  }

  /**
   * @description 获取用户资料
   * @param username 用户名
   * @returns 
   */
  public getUserProfile (username: string) {
    return this.callApiWithCallback(packets.encode.GetUserProfile(username), 'UserProfileCallback') as Promise<UserProfileCallback>
  }
}