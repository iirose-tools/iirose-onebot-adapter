import { bots } from "."

interface UserData {
  email: string,
  location: string,
  website: string,
  hobby: string,
  intro: string,
  background: string,
  music: string,
  lastLoginTime: Date,
  visits: string,
  title: string,
  rooms: string[],
  tags: string,
  regTime: Date,
  online: string,
  credit: string,
  life: {
    image: string,
    time: Date,
    desc: string
  }[],
  mate: {
    username: string | null,
    avatar: string | null,
    color: string | null
  },
  money: {
    hold: string,
    bank: string
  },
  like: {
    times: number,
    users: string[]
  }
}

class User {
  public data?: UserData
  public uid?: string
  public username?: string
  constructor({ uid, username }: { uid?: string, username?: string }) {
    this.uid = uid
    this.username = username

    if (!uid && !username) {
      throw new Error("uid or username must be provided")
    }
  }
}

class GlobalUserCache {
  private users: User[] = []

  public get({ uid, username }: { uid?: string, username?: string }) {
    const user = this.users.find(user => user.uid === uid || user.username === username)
    return user
  }

  public set({ uid, username }: { uid?: string, username?: string }) {
    const user = new User({ uid, username })
    this.users.push(user)
    return user
  }

  public update({ uid, username }: { uid?: string, username?: string }) {
    const user = this.get({ uid, username })
    if (user) {
      user.uid = uid
      user.username = username

      return true
    }

    return false
  }

  public async syncAllData({ uid, username }: { uid?: string, username?: string }) {
    const user = this.get({ uid, username })
    if (!user || !user.username) throw new Error("user not found")

    const bot = bots.find(bot => bot.online)

    if (!bot) throw new Error("all bots offline")

    const profile = await bot.getUserProfile(user.username)
    if (!profile) throw new Error("user not found")

    user.data = profile

    return user
  }

  public getAll() {
    return this.users
  }
}

export default new GlobalUserCache()
