import axios from "axios";
import { getConfig } from "../../core/config";

export const upload = async (buffer: Buffer): Promise<string> => {
  const url = 'https://f.iirose.com/lib/php/system/file_upload.php'
  const resp = await axios.postForm(url, {
    i: getConfig('app.owner.uid'),
    'f[]': buffer
  })

  return resp.data
}

export const download = async (id: string): Promise<Buffer> => {
  const url = `https://r.iirose.com/${id}`
  const resp = await axios.get(url, {
    responseType: 'arraybuffer'
  })

  return resp.data
}

export const url = (id: string): string => {
  return `https://r.iirose.com/${id}`
}