import dayjs from 'dayjs'
import { useRef, useState } from 'react'

/**
 * 时间戳转时间字符串
 * @param timestamp 要转换的时间戳
 * @param format 转换格式
 * @returns 转换后的时间字符串
 */
export const timestamp2time = (timestamp: number, format = 'YYYY-MM-DD HH:mm') => {
  if (timestamp) {
    return dayjs(timestamp).format(format)
  }
  return ''
}

/**
 * 时间戳转日期字符串
 * @param timestamp 要转换的时间戳
 * @param format 转换格式
 * @returns 转换后的日期字符串
 */
export const timestamp2date = (timestamp: number, format = 'YYYY-MM-DD') => {
  if (timestamp) {
    return dayjs(timestamp).format(format)
  }
  return ''
}

/**
 * 开始日期转时间戳
 * @param d 开始日期 例如 `2020-02-2`
 * @returns 转换后的开始日期时间戳
 */
export const startDate2timestamp = (d: string) => {
  return dayjs(`${d} 00:00:00`).valueOf()
}

/**
 * 结束日期转时间戳
 * @param d 结束日期 例如 `2020-02-2`
 * @returns 转换后的结束日期时间戳
 */
export const endDate2timestamp = (d: string) => {
  return dayjs(`${d} 23:59:59`).valueOf()
}

/**
 * 格式化时间段（日期处于同一天时显示格式为YYYY-MM-DD HH-mm~HH-mm）
 * @param timeStr1 开始时间
 * @param timeStr2 结束时间
 */
export const formatRangeTime = (timeStr1: number, timeStr2: number) => {
  const time1 = dayjs(timeStr1)
  const time2 = dayjs(timeStr2)
  const format = 'YYYY-MM-DD HH:mm'
  if (time2.isAfter(time1, 'date')) {
    return `${time1.format(format)}~${time2.format(format)}`
  }
  return `${time1.format('YYYY-MM-DD')} ${time1.format('HH:mm')}~${time2.format('HH:mm')}`
}

/**
 * 获取开始、结束
 */
export const getStartEndDayjs = (day = 7) => {
  const end = dayjs().hour(23).minute(59).second(59).millisecond(0)
  const start = end
    .clone()
    .subtract(day - 1, 'days')
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0)

  return [start, end]
}

/** 格式化聊天时间 */
export const chatTimeFormat = (timeStamp: number) => {
  const nowStamp = new Date().getTime()
  const durationTime = nowStamp - timeStamp

  const CNDay = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    0: '星期日',
  }

  if (new Date().getFullYear() === new Date(timeStamp).getFullYear()) {
    // 今年之内的
    // 今天
    if (durationTime <= 1000 * 60 * 60 * 24) return dayjs(timeStamp).format('HH:mm')

    // 昨天
    if (durationTime > 1000 * 60 * 60 * 24 && durationTime <= 1000 * 60 * 60 * 24 * 2)
      return `昨天 ${dayjs(timeStamp).format('HH:mm')}`

    // 昨天之前 ~ 一周内
    if (durationTime > 1000 * 60 * 60 * 24 * 2 && durationTime <= 1000 * 60 * 60 * 24 * 7)
      return `${CNDay[dayjs(timeStamp).day()]} ${dayjs(timeStamp).format('HH:mm')}`

    // 一周开外
    if (durationTime > 1000 * 60 * 60 * 24 * 7) return `${dayjs(timeStamp).format('M月D日 HH:mm')}`
  } else {
    // 今年以前的
    return `${dayjs(timeStamp).format('YYYY年M月D日 HH:mm')}`
  }
}

// 音乐时间转换
export const convertTime = minutes => {
  if (minutes) {
    const hrs = minutes / 60
    const minute = hrs.toString().split('.')[0]
    const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2))
    const sec = Math.ceil((60 * percent) / 100)
    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`
    }

    if (sec == 60) {
      return `${minute + 1}:00`
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`
    }

    if (sec < 10) {
      return `${minute}:0${sec}`
    }

    return `${minute}:${sec}`
  }
}

export const useIntervalTime = () => {
  const time = useRef({ ms: 0, s: 0 })
  const [interv, setInterv] = useState()

  const start = () => {
    run()
    setInterv(setInterval(run, 10) as any)
  }

  const pause = () => {
    clearInterval(interv)
  }

  const resume = () => start()

  const reset = () => {
    clearInterval(interv)
    time.current = { ms: 0, s: 0 }
  }

  const run = () => {
    const times = time.current
    let ms = times.ms,
      s = times.s

    if (ms === 100) {
      s++
      ms = 0
    }
    if (s === 60) {
      s = 0
    }

    ms++
    time.current = { ms, s }
    return [time.current, start, pause, resume, reset]
  }
}

export const formatTime = (ms: number): string => {
  const minutes: number = Math.floor(ms / 60000)
  // @ts-ignore
  const seconds: number = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
