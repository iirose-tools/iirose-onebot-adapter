import crypto from 'crypto'

const md5 = (str: string): string => crypto.createHash('md5').update(str).digest('hex')

export default (username: string, password: string, room: string) => {
  const data = {
    r: room,
    n: username,
    p: md5(password),
    st: 'n',
    mo: '',
    mb: '',
    mu: '01',
    fp: `@${md5(username)}`
  }

  return `*${JSON.stringify(data)}`
}
