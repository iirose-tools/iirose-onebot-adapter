import { EventEmitter } from 'ws'
import { version } from '../core/version'
import * as v12 from './v12'

// TODO: 写上支持的事件
export const supportedActions: string[] = [
  // 消息操作
  'send_message',
  'delete_message',
  // 元动作
  'get_status',
  'get_version',
  // 用户动作
  'get_self_info',      // 固定信息
  'get_user_info',      // 从用户信息API读取数据
  'get_friend_list',    // 返回当前所有房间的用户列表
  // 群事件
  'get_group_info',   // 返回固定的房间信息
  'get_group_list',   // 返回在线机器人信息以及房间列表
  'get_group_member_info',  // 从用户信息API读取数据
  'set_group_name',  // 兼容性接口，不做任何操作
  'leave_group',     // 兼容性接口，根据配置文件决定是否离开房间
  // 文件操作
  'upload_file',  // 上传文件
  'upload_file_fragmented',   // 上传文件（分片）
  'get_file',      // 下载文件
  'get_file_fragmented'   // 下载文件（分片）
]

export const eventPipe = new EventEmitter()
export const boardcast = v12.boardcast

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
      callback('ok', 0, supportedActions)
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
      if (!supportedActions.includes(action)) {
        callback('failed', 10002, null, 'Unsupported Action: action not supported on this server')
        return
      }
      eventPipe.emit('request', action, params, callback)
      break;
  }
})