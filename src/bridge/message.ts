import * as files from "./uploads"

export interface Message {
  type: 'text' | 'mention' | 'mention_all' | 'image' | 'audio' | 'voice' | 'video' | 'file' | 'reply' | 'location',
  data: {
    text?: string,
    user_id?: string,
    file_id?: string,
    latitude?: number,
    longitude?: number,
    title?: string,
    content?: string,
  }
}

export interface Messages extends Array<Message> { }

export const msg2str = (msg: Messages) => {
  return msg.map(async item => {
    switch (item.type) {
      case 'text':
        if (!item.data.text) throw new Error('Text message must have text')
        return item.data.text
      case 'mention':
        if (!item.data.user_id) throw new Error('Mention message must have mention')
        // TODO: 从Bot中读取用户名，读取不到则使用uid进行at
        return ` [*${item.data.user_id}*] `
      case 'mention_all':
        return ''
      case 'image':
        if (!item.data.file_id) throw new Error('Image message must have file_id')
        return `[${await files.url(item.data.file_id)}]`
      case 'audio':
        if (!item.data.file_id) throw new Error('Image message must have file_id')
        return `[${await files.url(item.data.file_id)}]`
      case 'voice':
        if (!item.data.file_id) throw new Error('Image message must have file_id')
        return `[${await files.url(item.data.file_id)}]`
      case 'video':
        if (!item.data.file_id) throw new Error('Image message must have file_id')
        return `[${await files.url(item.data.file_id)}]`
      case 'file':
        if (!item.data.file_id) throw new Error('Image message must have file_id')
        return `[${await files.url(item.data.file_id)}]`
      case 'reply':
        if (!item.data.file_id) throw new Error('Image message must have file_id')
        return `[${await files.url(item.data.file_id)}]`
      case 'location':
        return `[位置共享] ${item.data.title}`
      default:
        return `[不支持的消息类型] ${item.type}`
    }
  }).join('\n')
}

export const str2msg = (str: string) => {
  const image_ext = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
  const audio_ext = ['mp3', 'wav', 'flac', 'ape', 'ogg']
  const video_ext = ['mp4', 'avi', 'mkv', 'rmvb', 'wmv', 'flv', 'mov']

  /*
    从字符串中解析消息，返回消息数组
    例如：
      文本内容xxx https://example.com/xxx.jpg 文本内容[https://example.com/xxx.mp3]文本内容
  */

  const msg: Messages = []

  // 匹配不带括号的链接，前后必须有空格或者开头结尾
  const link_without_brackets = /(^|\s)(http(s|)?:\/\/[^\s]+)(\s|$)/g
  // 匹配带括号的链接，前后需要有方括号，不需要空格
  const link_with_brackets = /\[(http(s|)?\:\/\/\S+)\]/g
  // 匹配at用户
  const mention = /\s+\[\*\d+\*\]\s+/g

  // 按照顺序解析消息，同时处理所有正则表达式
  let last_index = 0
  let match: RegExpExecArray | null
  while (
    match = link_without_brackets.exec(str) ||
    link_with_brackets.exec(str) ||
    mention.exec(str)
  ) {
    const text = str.slice(last_index, match.index)
    if (text) {
      msg.push({
        type: 'text',
        data: {
          text
        }
      })
    }
    
    const isAt = match[0].includes('[*')
    if (isAt) {
      msg.push({
        type: 'mention',
        data: {
          // TODO: 从Bot中读取用户名，读取不到则使用用户名
          user_id: match[0].slice(3, -3)
        }
      })
    } else {
      const url = match[0].slice(1, -1)
      const ext = url.split('.').pop()?.toLowerCase() as string
      if (image_ext.includes(ext)) {
        msg.push({
          type: 'image',
          data: {
            file_id: `url:${url}`
          }
        })
      } else if (audio_ext.includes(ext)) {
        msg.push({
          type: 'audio',
          data: {
            file_id: `url:${url}`
          }
        })
      } else if (video_ext.includes(ext)) {
        msg.push({
          type: 'video',
          data: {
            file_id: `url:${url}`
          }
        })
      } else {
        msg.push({
          type: 'file',
          data: {
            file_id: `url:${url}`
          }
        })
      }
    }

    last_index = match.index + match[0].length

    // 重置正则表达式的匹配位置
    link_without_brackets.lastIndex = last_index
    link_with_brackets.lastIndex = last_index
    mention.lastIndex = last_index
  }

  if (last_index < str.length) {
    msg.push({
      type: 'text',
      data: {
        text: str.slice(last_index)
      }
    })
  }

  return msg
}
