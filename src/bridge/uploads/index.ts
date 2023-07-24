import * as iirose from './iirose'
import * as _url from './url'

const providers = {
  iirose,
  url: _url
}

type provider = keyof typeof providers

export const upload = async (provider: provider, file: Buffer) => {
  if (!providers[provider]) throw new Error('Provider not found')
  const id = await providers[provider].upload(file)

  return `${provider}:${id}`
}

export const download = async (id: string) => {
  const data = id.split(':')
  const provider = data[0] as provider
  const fileId = data[1] as string

  if (!providers[provider]) throw new Error('Provider not found')
  const file = await providers[provider].download(fileId)

  return file
}

export const url = async (id: string) => {
  const data = id.split(':')
  const provider = data[0] as provider
  const fileId = data[1] as string

  if (!providers[provider]) throw new Error('Provider not found')
  const url = await providers[provider].url(fileId)

  return url
}