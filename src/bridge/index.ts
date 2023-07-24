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
    const detail_type = params.detail_type
    if (detail_type === 'group') {
      const id = params.group_id as number
      const bot = bots[id]
      if (!bot) {
        callback('failed', 35001, null, 'Logic Error: group not found')
        return
      }

      const msgStr = MessageProcessor.msg2str(params.message)
      bot.sendPublicMessage(msgStr)
    }
  }
})