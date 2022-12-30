import DecodeJoinRoom from './decoders/JoinRoom'
import DecodeLeaveRoom from './decoders/LeaveRoom'
import DecodeSwitchRoom from './decoders/SwitchRoom'
import DecodePublicMessage from './decoders/PublicMessage'
import DecodePrivateMessage from './decoders/PrivateMessage'

import EncodePrivateMessage from './encoders/PrivateMessage'
import EncodePublicMessage from './encoders/PublicMessage'

export default {
  encode: {
    PrivateMessage: EncodePrivateMessage,
    PublicMessage: EncodePublicMessage
  },
  decode: (packet: string) => {
    const funcs = [
      DecodeJoinRoom,
      DecodeLeaveRoom,
      DecodeSwitchRoom,
      DecodePublicMessage,
      DecodePrivateMessage
    ]

    for (const func of funcs) {
      const result = func(packet)
      if (result && result.length > 0) return result
    }
  }
}