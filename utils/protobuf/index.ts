import { INamespace, Root } from 'protobufjs'
// @ts-ignore
import protoJson from './proto/proto.json'
export const root = Root.fromJSON(protoJson as INamespace)

/**
 * 生成消息体
 * @param {string} reqDesction 请求体名字
 * @param {object} data 请求数据
 * @return {Buffer} 返回Buffer对象
 */
export const requestEncode = (reqDesction: string, data: object) => {
  const reqDesctionData = root.lookupType(reqDesction)
  const err = reqDesctionData.verify(data)
  if (err) {
    return false
  }

  const message = reqDesctionData.create(data)
  const buffer = reqDesctionData.encode(message).finish()

  return buffer
}

/**
 * 解析响应体
 * @param {string} resDesction 返回体名字
 * @param {Uint8Array} data 返回的数据
 * @return {object} 解析完的数据
 */
export const responseDecode = (reqDesction: string, data: Uint8Array) => {
  const resDesctionData = root.lookupType(reqDesction)
  const res = resDesctionData.decode(data)
  const result = resDesctionData.toObject(res, {
    defaults: true,
  })

  return result
}
