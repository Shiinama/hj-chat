import { encode } from 'base64-arraybuffer'

//链接buffer
export function concatBuffer(...arrays) {
  let totalLen = 0

  for (let arr of arrays) totalLen += arr.byteLength

  let res = new Uint8Array(totalLen)

  let offset = 0

  for (let arr of arrays) {
    let uint8Arr = new Uint8Array(arr)

    res.set(uint8Arr, offset)

    offset += arr.byteLength
  }
  return res.buffer
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  return encode(buffer)
}
