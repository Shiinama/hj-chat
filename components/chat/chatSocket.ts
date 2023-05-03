import {
  BehaviorSubject,
  first,
  firstValueFrom,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
  timeout,
} from 'rxjs'
import { io, Socket } from 'socket.io-client'

import type { MessageDetail } from '@/apis/interfaces'
import { Alert } from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import SysConfig from '../../constants/System'
export enum MsgEvents {
  AUTH_FAIL = 'auth_fail',
  USER_BOT_INFO = 'user_bot_info',
  ERROR = 'message_error',
  UPDATED = 'message_updated',
  TRANSLATED = 'message_translated',
  SENT = 'message_sent',
  REPLIED = 'message_replied',
  LIMIT_REACHED = 'limit_reached',
  EXCEPTION = 'exception',
}

class ChatService {
  private socket!: Socket
  private disconnect$ = new Subject<any>()

  userBotInfo$ = new BehaviorSubject<
    Array<{
      botId: number
      level: number
      limit: number
      count: number
    }>
  >([])
  limitReached$ = new Subject<{ botId: number; botUid: string; botName: string }>()

  messageSent$ = new Subject<MessageDetail>()
  messageReplied$ = new Subject<MessageDetail>()
  messageUpdated$ = new Subject<MessageDetail>()
  messageTranslated$ = new Subject<MessageDetail>()

  messageResponse$ = new Subject<{
    reqId: string
    eventName: MsgEvents
    data?: MessageDetail | any
    message?: string
  }>()

  ready(): boolean {
    return this.socket && this.socket.connected
  }

  init() {
    if (this.ready()) {
      return
    }
    this.socket?.disconnect()
    this.socket = io(`${SysConfig.baseUrl}/chat`, {
      path: '/ws',
      transports: ['websocket'],
      auth: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNeVNoZWxsU3RhZ2luZyIsInN1YiI6MzA2LCJhdWQiOiJNeVNoZWxsU3RhZ2luZyIsIm5iZiI6MCwiaWF0IjoxNjgzMDA0MzE2ODk4LCJqdGkiOiJiNDYxNDgyZWQ2M2Q0YmQyOTcyZjFkNzlmNjIxOTE3NyIsInNlY3VyaXR5U3RhbXAiOiJmOTRkMDE5OGY2OTA0ODUwODIwYjJjMDkxYTFiODQwNCIsImV4cCI6MTY4MzAwNjkwODg5OH0.QiJIpWoeL3KIzklo8d8IaXBCsaJUK45OuCvHQwFqZo4',
      },
    })
    // TODO: reconnect when token changed
    this.socket.on('connect_error', () => {
      Alert.alert('Failed to connect to server')
    })
    this.socket.on('disconnect', (reason: any) => {
      this.disconnect$.next(reason)
    })
    this.socket.on('connect', () => {
      // console.log('WebSocket connected');
    })
    this.socket.on(MsgEvents.ERROR, this.onMessageError)
    this.socket.on(MsgEvents.EXCEPTION, this.onException)
    this.socket.on(MsgEvents.SENT, this.onMessageSent)
    this.socket.on(MsgEvents.REPLIED, this.onMessageReplied)
    this.socket.on(MsgEvents.UPDATED, this.onMessageUpdated)
    this.socket.on(MsgEvents.TRANSLATED, this.onMessageTranslated)
    this.socket.on(MsgEvents.USER_BOT_INFO, this.onUserBotInfo)
    this.socket.on(MsgEvents.LIMIT_REACHED, this.onLimitReached)
  }

  textChat(text: string, botUid: string): Promise<MessageDetail> {
    if (!this.ready()) {
      return Promise.reject('Failed to connect to server')
    }
    const reqId = uuidv4()

    return firstValueFrom(
      new Observable((subscriber: any) => {
        this.socket.emit('text_chat', {
          reqId: reqId,
          botUid: botUid,
          text,
        })
        subscriber.next()
        subscriber.complete()
      }).pipe(
        switchMap(() => {
          return this.messageResponse$
        }),
        first((value: any) => {
          return (
            value.reqId === reqId &&
            (value.eventName === MsgEvents.ERROR ||
              value.eventName === MsgEvents.LIMIT_REACHED ||
              value.eventName === MsgEvents.SENT)
          )
        }),
        switchMap((value: any) => {
          if (value.eventName === MsgEvents.ERROR) {
            return throwError(() => new Error(value.message))
          }
          if (value.eventName === MsgEvents.LIMIT_REACHED) {
            return throwError(() => new Error(`Limit reached for bot ${value.data.botName}`))
          }

          return of(value.data)
        }),
        timeout(15000),
        takeUntil(this.disconnect$)
      )
    )
  }

  voiceChat(voice: Blob, botUid: string): Promise<MessageDetail> {
    if (!this.ready()) {
      return Promise.reject('Failed to connect to server')
    }
    const reqId = uuidv4()

    return firstValueFrom(
      new Observable((subscriber: any) => {
        this.socket.emit('voice_chat', {
          reqId: reqId,
          botUid: botUid,
          voice,
        })
        subscriber.next()
        subscriber.complete()
      }).pipe(
        switchMap(() => {
          return this.messageResponse$
        }),
        first((value: any) => {
          return (
            value.reqId === reqId &&
            (value.eventName === MsgEvents.ERROR ||
              value.eventName === MsgEvents.LIMIT_REACHED ||
              value.eventName === MsgEvents.SENT)
          )
        }),
        switchMap((value: any) => {
          if (value.eventName === MsgEvents.ERROR) {
            return throwError(() => new Error(value.message))
          }
          if (value.eventName === MsgEvents.LIMIT_REACHED) {
            return throwError(() => new Error(`Limit reached for bot ${value.data.botName}`))
          }

          return of(value.data)
        }),
        timeout(15000),
        takeUntil(this.disconnect$)
      )
    )
  }

  translate(messageUid: string): Observable<MessageDetail> {
    if (!this.ready()) {
      return throwError(() => {
        return new Error('Failed to connect to server')
      })
    }
    const reqId = uuidv4()

    return new Observable((subscriber: any) => {
      this.socket.emit('translate_message', {
        reqId: reqId,
        messageUid: messageUid,
      })
      subscriber.next()
      subscriber.complete()
    }).pipe(
      switchMap(() => {
        return this.messageResponse$
      }),
      first((value: any) => {
        return (
          value.reqId === reqId && (value.eventName === MsgEvents.ERROR || value.eventName === MsgEvents.TRANSLATED)
        )
      }),
      switchMap((value: any) => {
        if (value.eventName === MsgEvents.ERROR) {
          return throwError(() => new Error(value.message))
        }

        return of(value.data)
      }),
      timeout(15000),
      takeUntil(this.disconnect$)
    )
  }

  private onUserBotInfo = (msg: any) => {
    this.userBotInfo$.next(msg.data)
  }

  private onLimitReached = (msg: any) => {
    this.messageResponse$.next({
      reqId: msg.reqId,
      eventName: MsgEvents.LIMIT_REACHED,
      data: msg.data,
    })
    this.limitReached$.next(msg.data)
  }

  private onException = (msg: any) => {
    if (msg.reqId) {
      this.messageResponse$.next({
        reqId: msg.reqId,
        eventName: MsgEvents.ERROR,
        message: msg.message,
      })
    }
  }

  private onMessageError = (msg: any) => {
    this.messageResponse$.next({
      reqId: msg.reqId,
      eventName: MsgEvents.ERROR,
      message: msg.message,
    })
  }

  private onMessageSent = (msg: any) => {
    this.messageResponse$.next({
      reqId: msg.reqId,
      eventName: MsgEvents.SENT,
      data: msg.data,
    })
    this.messageSent$.next(msg.data)
  }

  private onMessageReplied = (msg: any) => {
    this.messageResponse$.next({
      reqId: msg.reqId,
      eventName: MsgEvents.REPLIED,
      data: msg.data,
    })
    this.messageReplied$.next(msg.data)
  }

  private onMessageUpdated = (msg: any) => {
    this.messageResponse$.next({
      reqId: msg.reqId,
      eventName: MsgEvents.UPDATED,
      data: msg.data,
    })
    this.messageUpdated$.next(msg.data)
  }

  private onMessageTranslated = (msg: any) => {
    this.messageResponse$.next({
      reqId: msg.reqId,
      eventName: MsgEvents.TRANSLATED,
      data: msg.data,
    })
    this.messageTranslated$.next(msg.data)
  }
}

export const chatService = new ChatService()
