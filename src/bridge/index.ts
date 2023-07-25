import Bot from "../iirose/bot";
import * as OneBot from '../onebot'
import { getConfig } from "../core/config";
import * as MessageProcessor from './message'

const bots: Bot[] = []

getConfig('accounts').forEach((account: any, index: number) => {
  const bot = new Bot(account)
  bots[index] = bot
  bots[index].index = index
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
    } else if (detail_type === 'private') {
      // 发送私聊消息
      const uid = params.user_id as string
      const bot = bots.sort(() => Math.random() - 0.5)[0]
      if (!bot) {
        callback('failed', 35001, null, 'Logic Error: bot not found')
        return
      }

      const msgStr = MessageProcessor.msg2str(params.message)
      bot.sendPrivateMessage(uid, msgStr, msgId)
    }

    callback('ok', 0, {
      time: Date.now() / 1000,
      message_id: msgId
    })
  } else if (action === 'delete_message') {
    // TODO: 撤回消息
  }
})