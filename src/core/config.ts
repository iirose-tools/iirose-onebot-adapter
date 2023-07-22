import config from '../../config.json'

export const getConfig = (key: string) => {
  const keys = key.split('.')
  let value: any = config

  for (const k of keys) {
    if (value instanceof Array) {
      value = value.map((v: any) => v[k])
      continue
    }

    value = value[k]
  }

  return value
}
