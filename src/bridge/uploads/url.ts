import axios from "axios";
import { getConfig } from "../../core/config";

export const upload = async (buffer: Buffer): Promise<string> => {
  const url = 'https://f.iirose.com/lib/php/system/file_upload.php'
  const resp = await axios.postForm(url, {
    i: getConfig('app.owner.uid'),
    'f[]': buffer
  })

  return `https://r.iirose.com/${resp.data}`
}

export const download = async (id: string): Promise<Buffer> => {
  const resp = await axios.get(id, {
    responseType: 'arraybuffer'
  })

  return resp.data
}

export const url = (id: string): string => {
  return id
}