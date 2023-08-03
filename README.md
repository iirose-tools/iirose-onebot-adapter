# 蔷薇花园OneBot网关
本项目用于将花园接入OneBot生态，以使用OneBot生态内的其他机器人程序

此项目的最终目标是尽可能完整的实现OneBot协议，尽可能多的兼容更多基于OneBot协议的应用，让花园的Bot也可以加入OneBot社区

目前主要开发目标是能让koishi和nonebot能在此项目的OneBot协议上跑起来~

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
      "room": "",  // 机器人所在房间
      "color": ""  // 机器人消息颜色
    },
    // 账号2
    {
      "username": "",  // 花园用户名
      "password": "",  // 花园密码
      "room": "",  // 机器人所在房间
      "color": ""  // 机器人消息颜色
    }
    // ... 可以添加更多账号
  ],
  "compatibility": {
    "events": {
      // 下游客户端获取到的机器人信息
      "self": {
        "platform": "iirose",
        "user_id": 15412469511
      },
      // 是否广播用户 进入/离开/切换 房间的事件（部分针对QQ开发的机器人程序可能会响应这些事件发送过长的消息）
      "enable_user_events": true
    },
    "actions": {
      // 当下游客户端调用无法实现或不兼容的API时是否返回成功（例如：群文件。若为false则会返回服务端不支持这个操作，为true时会伪造虚假的数据返回给客户端）
      "always_return_success": true,
      // 允许下游客户端调用离开群组的API，对应的机器人会主动下线
      "allow_leave_room": false
    }
  },
  "app": {
    // 机器人所有者信息
    "owner": {
      "name": "xxx",
      "uid": "xxx"
    }
  }
}
```
