import Bot from "../iirose/bot";
import * as OneBot from '../onebot'
import { getConfig } from "../core/config";
import * as MessageProcessor from './message'
import id from "../core/id";
import Users from "./Users";

export const bots: Bot[] = []

getConfig('accounts').forEach((account: any, index: number) => {
  const bot = new Bot(account)
  bots[index] = bot
  bots[index].index = index

  bot.on('PublicMessage', msg => {
    const username = msg.username
    const uid = msg.uid

    const user = Users.get({ uid, username })
    if (!user) {
      Users.set({ uid, username })
    } else {
      Users.update({ uid, username })
    }

    OneBot.boardcast(JSON.stringify({
      "id": id(),
      "self": getConfig('compatibility.events.self'),
      "time": Date.now() / 1000,
      "type": "message",
      "detail_type": "group",
      "sub_type": "",
      "message_id": msg.messageId,
      "message": [
        ...MessageProcessor.str2msg(msg.message)
        // TODO: 处理回复消息
      ],
      "alt_message": msg.message,
      "group_id": index.toString(),
      "user_id": msg.uid
    }))
  })
})

OneBot.eventPipe.on('request', (action, params, callback) => {
  if (action === 'get_status') {
    // 获取在线状态
    const hasOffline = bots.some(bot => !bot.online)

    callback('ok', 0, {
      good: !hasOffline,
      bots: [{
        self: getConfig('compatibility.events.self'),
        online: !hasOffline,
      }]
    })
  } else if (action === 'get_user_info') {
    const user = Users.get({ uid: params.user_id as string })
    if (!user) {
      return callback('failed', 35001, null, 'User not found')
    }
  } else if (action === 'get_friend_list') {
    const list = Users.getAll().map(item => {
      return {
        user_id: item.uid,
        user_name: item.username,
        user_displayname: "",
        user_remark: item.username,
      }
    })

    callback('ok', 0, list, 'success')
  } else if (action === 'send_message') {
    // 发送消息
    const detail_type = params.detail_type
    const msgId = Math.random().toString().substring(2, 12)
    if (detail_type === 'group') {
      // 发送群消息
      const id = params.group_id as string
      const bot = bots[parseInt(id)]
      if (!bot) {
        callback('failed', 35001, null, 'Logic Error: group not found')
        return
      }

      const msgStr = MessageProcessor.msg2str(params.message)
      bot.sendPublicMessage(msgStr, msgId)

      callback('ok', 0, {
        time: Date.now() / 1000,
        message_id: `${id}:${msgId}`
      })
    } else if (detail_type === 'private') {
      // 发送私聊消息
      const uid = params.user_id as string
      const bot = bots.sort(() => Math.random() - 0.5)[0]
      const botId = bot.index
      if (!bot) {
        callback('failed', 35001, null, 'Logic Error: bot not found')
        return
      }

      const msgStr = MessageProcessor.msg2str(params.message)
      bot.sendPrivateMessage(uid, msgStr, msgId)

      callback('ok', 0, {
        time: Date.now() / 1000,
        message_id: `${botId}:${msgId}`
      })
    }
  } else if (action === 'delete_message') {
    // 撤回消息
    const id = params.message_id as string
    const index = id.split(':')[0]
    const bot = bots[parseInt(index)]

    const msgId = id.split(':')[1]

    bot.deleteMessage(msgId)

    callback('ok', 0, null)
  }
})