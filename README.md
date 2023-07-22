# 蔷薇花园OneBot网关
本项目用于将花园接入OneBot生态，以使用OneBot生态内的其他机器人程序

## ToDo
- [x] ~~基础消息协议(可以直接照着YakumoRan的做)~~
- [ ] 正向HTTP
- [ ] 反向HTTP
- [ ] 正向WebSocket
- [ ] 反向WebSocket
- [ ] OneBot协议的实现
- [ ] 文件/图片上传
- [ ] 多账户登录（对应多个群）
- [ ] and more...

## 配置文件
```js
{
  "server": {
    "v12": {
      "ws": {
        "port": 6700,
        "host": "127.0.0.1",
        "access_token": "test", // OneBot的 Access Token
        "heartbeat": {
          // 心跳包配置，单位为毫秒
          "enable": true,
          "interval": 30000
        }
      }
    }
  },
  // 账号配置
  "accounts": [
    // 账号1
    {
      "username": "",  // 花园用户名
      "password": "",  // 花园密码
      "root": "",  // 机器人所在房间
      "color": ""  // 机器人消息颜色
    },
    // 账号2
    {
      "username": "",  // 花园用户名
      "password": "",  // 花园密码
      "root": "",  // 机器人所在房间
      "color": ""  // 机器人消息颜色
    }
    // ... 可以添加更多账号
  ],
  // 兼容性配置
  "compatibility": {
    "files": {
      // 是否主动下载消息中的文件，若为true则会主动下载消息中的文件并发送file_id给客户端，若为false则会发送文件的url给客户端
      "download_all_files": false,
      // 文件ID映射，启用后会将文件名和文件ID进行映射，并记录在本地，此选项不会下载文件，但仍然会创建文件用于记录映射信息
      "file_id_index": true
    },
    "events": {
      "self": {
        // 下游客户端获取到的机器人信息
        "platform": "iirose",
        "user_id": 0
      },
      // 是否广播用户 进入/离开/切换 房间的事件（部分针对QQ开发的机器人程序可能会响应这些事件发送过长的消息）
      "enable_user_events": true
    },
    "actions": {
      // 当下游客户端调用无法实现或不兼容的API时是否返回成功（例如：群文件。若为false则会返回服务端不支持这个操作，为true时会伪造虚假的数据返回给客户端）
      "always_return_success": true
    }
  }
}
```
