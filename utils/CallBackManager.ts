export class CallBackManager {
  private callBackMap: { [key: string]: Function } = {}

  constructor() {}

  add(key: string, callBack: Function) {
    this.callBackMap[key] = callBack
  }

  remove(key: string) {
    this.callBackMap[key] = undefined
    delete this.callBackMap[key]
  }

  execute(key: string) {
    this.callBackMap[key]?.()
  }

  removeAll() {
    this.callBackMap = {}
  }
}

const CallBackManagerSingle = (function () {
  let instance: CallBackManager
  return function () {
    if (instance) return instance
    instance = new CallBackManager()
    return instance
  }
})()

export default CallBackManagerSingle
