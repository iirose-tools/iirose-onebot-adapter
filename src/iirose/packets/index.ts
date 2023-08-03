import DecodeJoinRoom from './decoders/JoinRoom'
import DecodeLeaveRoom from './decoders/LeaveRoom'
import DecodeSwitchRoom from './decoders/SwitchRoom'
import DecodePublicMessage from './decoders/PublicMessage'
import DecodePrivateMessage from './decoders/PrivateMessage'
import DecodeUserProfile from './decoders/ProfileCallback'

import EncodePrivateMessage from './encoders/PrivateMessage'
import EncodePublicMessage from './encoders/PublicMessage'
import Login from './encoders/Login'
import DeleteMessage from './encoders/DeleteMessage'
import GetUserProfile from './encoders/GetUserProfile'

export default {
  encode: {
    PrivateMessage: EncodePrivateMessage,
    PublicMessage: EncodePublicMessage,
    DeleteMessage: DeleteMessage,
    Login: Login,
    GetUserProfile: GetUserProfile
  },
  decode: (packet: string) => {
    const funcs = [
      DecodeJoinRoom,
      DecodeLeaveRoom,
      DecodeSwitchRoom,
      DecodePublicMessage,
      DecodePrivateMessage,
      DecodeUserProfile
    ]

    for (const func of funcs) {
      const result = func(packet)
      if (result && result.length > 0) return result
    }
  }
}