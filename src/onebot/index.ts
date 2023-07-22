import { version } from '../core/version'
import * as v12 from './v12'

// TODO: 写上支持的事件
const supported_actions: string[] = []

v12.globalEvent.on('message', (data, emitter) => {
  const action = data.action
  const params = data.params
  const echo = data.echo

  const callback = (status: 'ok' | 'failed', retcode: number, data?: any, message?: string) => {
    emitter(status, retcode, data, message, echo || null)
  }

  switch (action) {
    case 'get_latest_events':
      // 获取历史事件（仅应该在 HTTP API 中使用）
      callback('failed', 10001, null, 'Bad Request: action not supported on websocket')
      break;
    case 'get_supported_actions':
      // 获取支持的事件
      callback('ok', 0, supported_actions)
      break;
    case 'get_status':
      // TODO: 从Bot中读取状态信息
      break;
    case 'get_version':
      // 获取版本信息
      callback('ok', 0, {
        impl: "iirose-onebot-adapter",
        version: `onebot-v12-adapter/${version}`,
        onebot_version: "12"
      })

      break;
    default:
      // 完全没有实现的功能
      callback('failed', 10002, null, 'Unsupported Action: action not supported on this server')
  }
})