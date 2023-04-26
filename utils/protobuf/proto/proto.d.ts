import * as $protobuf from 'protobufjs';
import Long = require('long');
/** Namespace im. */
export namespace im {
  /** Namespace chat. */
  namespace chat {
    /** Represents a ChatService */
    class ChatService extends $protobuf.rpc.Service {
      /**
       * Constructs a new ChatService service.
       * @param rpcImpl RPC implementation
       * @param [requestDelimited=false] Whether requests are length-delimited
       * @param [responseDelimited=false] Whether responses are length-delimited
       */
      constructor(
        rpcImpl: $protobuf.RPCImpl,
        requestDelimited?: boolean,
        responseDelimited?: boolean,
      );

      /**
       * Creates new ChatService service using the specified rpc implementation.
       * @param rpcImpl RPC implementation
       * @param [requestDelimited=false] Whether requests are length-delimited
       * @param [responseDelimited=false] Whether responses are length-delimited
       * @returns RPC service. Useful where requests and/or responses are streamed.
       */
      public static create(
        rpcImpl: $protobuf.RPCImpl,
        requestDelimited?: boolean,
        responseDelimited?: boolean,
      ): ChatService;

      /**
       * Calls SendChatMsg.
       * @param request ChatMsgReq message or plain object
       * @param callback Node-style callback called with the error, if any, and ChatMsgResp
       */
      public sendChatMsg(
        request: im.chat.IChatMsgReq,
        callback: im.chat.ChatService.SendChatMsgCallback,
      ): void;

      /**
       * Calls SendChatMsg.
       * @param request ChatMsgReq message or plain object
       * @returns Promise
       */
      // eslint-disable-next-line no-dupe-class-members
      public sendChatMsg(
        request: im.chat.IChatMsgReq,
      ): Promise<im.chat.ChatMsgResp>;
    }

    namespace ChatService {
      /**
       * Callback as used by {@link im.chat.ChatService#sendChatMsg}.
       * @param error Error, if any
       * @param [response] ChatMsgResp
       */
      type SendChatMsgCallback = (
        error: Error | null,
        response?: im.chat.ChatMsgResp,
      ) => void;
    }

    /** Properties of a ChatMsgReq. */
    interface IChatMsgReq {
      /** ChatMsgReq msg */
      msg?: im.chat.IChatMsg | null;
    }

    /** Represents a ChatMsgReq. */
    class ChatMsgReq implements IChatMsgReq {
      /**
       * Constructs a new ChatMsgReq.
       * @param [properties] Properties to set
       */
      constructor(properties?: im.chat.IChatMsgReq);

      /** ChatMsgReq msg. */
      public msg?: im.chat.IChatMsg | null;

      /**
       * Creates a new ChatMsgReq instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChatMsgReq instance
       */
      public static create(
        properties?: im.chat.IChatMsgReq,
      ): im.chat.ChatMsgReq;

      /**
       * Encodes the specified ChatMsgReq message. Does not implicitly {@link im.chat.ChatMsgReq.verify|verify} messages.
       * @param message ChatMsgReq message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: im.chat.IChatMsgReq,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChatMsgReq message, length delimited. Does not implicitly {@link im.chat.ChatMsgReq.verify|verify} messages.
       * @param message ChatMsgReq message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: im.chat.IChatMsgReq,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChatMsgReq message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChatMsgReq
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): im.chat.ChatMsgReq;

      /**
       * Decodes a ChatMsgReq message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChatMsgReq
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): im.chat.ChatMsgReq;

      /**
       * Verifies a ChatMsgReq message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: {[k: string]: any}): string | null;

      /**
       * Creates a ChatMsgReq message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChatMsgReq
       */
      public static fromObject(object: {[k: string]: any}): im.chat.ChatMsgReq;

      /**
       * Creates a plain object from a ChatMsgReq message. Also converts values to other types if specified.
       * @param message ChatMsgReq
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: im.chat.ChatMsgReq,
        options?: $protobuf.IConversionOptions,
      ): {[k: string]: any};

      /**
       * Converts this ChatMsgReq to JSON.
       * @returns JSON object
       */
      public toJSON(): {[k: string]: any};

      /**
       * Gets the default type url for ChatMsgReq
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ChatMsgResp. */
    interface IChatMsgResp {
      /** ChatMsgResp msg */
      msg?: im.chat.IChatMsg | null;
    }

    /** Represents a ChatMsgResp. */
    class ChatMsgResp implements IChatMsgResp {
      /**
       * Constructs a new ChatMsgResp.
       * @param [properties] Properties to set
       */
      constructor(properties?: im.chat.IChatMsgResp);

      /** ChatMsgResp msg. */
      public msg?: im.chat.IChatMsg | null;

      /**
       * Creates a new ChatMsgResp instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChatMsgResp instance
       */
      public static create(
        properties?: im.chat.IChatMsgResp,
      ): im.chat.ChatMsgResp;

      /**
       * Encodes the specified ChatMsgResp message. Does not implicitly {@link im.chat.ChatMsgResp.verify|verify} messages.
       * @param message ChatMsgResp message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: im.chat.IChatMsgResp,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChatMsgResp message, length delimited. Does not implicitly {@link im.chat.ChatMsgResp.verify|verify} messages.
       * @param message ChatMsgResp message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: im.chat.IChatMsgResp,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChatMsgResp message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChatMsgResp
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): im.chat.ChatMsgResp;

      /**
       * Decodes a ChatMsgResp message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChatMsgResp
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): im.chat.ChatMsgResp;

      /**
       * Verifies a ChatMsgResp message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: {[k: string]: any}): string | null;

      /**
       * Creates a ChatMsgResp message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChatMsgResp
       */
      public static fromObject(object: {[k: string]: any}): im.chat.ChatMsgResp;

      /**
       * Creates a plain object from a ChatMsgResp message. Also converts values to other types if specified.
       * @param message ChatMsgResp
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: im.chat.ChatMsgResp,
        options?: $protobuf.IConversionOptions,
      ): {[k: string]: any};

      /**
       * Converts this ChatMsgResp to JSON.
       * @returns JSON object
       */
      public toJSON(): {[k: string]: any};

      /**
       * Gets the default type url for ChatMsgResp
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** ReceiverType enum. */
    enum ReceiverType {
      RECEIVER_INVALID = 0,
      GROUP = 1,
      USER = 2,
    }

    /** Properties of a ChatMsg. */
    interface IChatMsg {
      /** ChatMsg id */
      id?: string | null;

      /** ChatMsg sendType */
      sendType?: im.chat.ChatMsg.SendType | null;

      /** ChatMsg sender */
      sender?: string | null;

      /** ChatMsg receiverType */
      receiverType?: im.chat.ReceiverType | null;

      /** ChatMsg receiver */
      receiver?: string | null;

      /** ChatMsg time */
      time?: number | Long | null;

      /** ChatMsg contentType */
      contentType?: im.chat.ChatMsg.ContentType | null;

      /** ChatMsg content */
      content?: string | null;

      /** ChatMsg replyChatMsgId */
      replyChatMsgId?: string | null;
    }

    /** Represents a ChatMsg. */
    class ChatMsg implements IChatMsg {
      /**
       * Constructs a new ChatMsg.
       * @param [properties] Properties to set
       */
      constructor(properties?: im.chat.IChatMsg);

      /** ChatMsg id. */
      public id?: string | null;

      /** ChatMsg sendType. */
      public sendType: im.chat.ChatMsg.SendType;

      /** ChatMsg sender. */
      public sender: string;

      /** ChatMsg receiverType. */
      public receiverType: im.chat.ReceiverType;

      /** ChatMsg receiver. */
      public receiver: string;

      /** ChatMsg time. */
      public time: number | Long;

      /** ChatMsg contentType. */
      public contentType: im.chat.ChatMsg.ContentType;

      /** ChatMsg content. */
      public content: string;

      /** ChatMsg replyChatMsgId. */
      public replyChatMsgId?: string | null;

      /** ChatMsg _id. */
      public _id?: 'id';

      /** ChatMsg _replyChatMsgId. */
      public _replyChatMsgId?: 'replyChatMsgId';

      /**
       * Creates a new ChatMsg instance using the specified properties.
       * @param [properties] Properties to set
       * @returns ChatMsg instance
       */
      public static create(properties?: im.chat.IChatMsg): im.chat.ChatMsg;

      /**
       * Encodes the specified ChatMsg message. Does not implicitly {@link im.chat.ChatMsg.verify|verify} messages.
       * @param message ChatMsg message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encode(
        message: im.chat.IChatMsg,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Encodes the specified ChatMsg message, length delimited. Does not implicitly {@link im.chat.ChatMsg.verify|verify} messages.
       * @param message ChatMsg message or plain object to encode
       * @param [writer] Writer to encode to
       * @returns Writer
       */
      public static encodeDelimited(
        message: im.chat.IChatMsg,
        writer?: $protobuf.Writer,
      ): $protobuf.Writer;

      /**
       * Decodes a ChatMsg message from the specified reader or buffer.
       * @param reader Reader or buffer to decode from
       * @param [length] Message length if known beforehand
       * @returns ChatMsg
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decode(
        reader: $protobuf.Reader | Uint8Array,
        length?: number,
      ): im.chat.ChatMsg;

      /**
       * Decodes a ChatMsg message from the specified reader or buffer, length delimited.
       * @param reader Reader or buffer to decode from
       * @returns ChatMsg
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      public static decodeDelimited(
        reader: $protobuf.Reader | Uint8Array,
      ): im.chat.ChatMsg;

      /**
       * Verifies a ChatMsg message.
       * @param message Plain object to verify
       * @returns `null` if valid, otherwise the reason why it is not
       */
      public static verify(message: {[k: string]: any}): string | null;

      /**
       * Creates a ChatMsg message from a plain object. Also converts values to their respective internal types.
       * @param object Plain object
       * @returns ChatMsg
       */
      public static fromObject(object: {[k: string]: any}): im.chat.ChatMsg;

      /**
       * Creates a plain object from a ChatMsg message. Also converts values to other types if specified.
       * @param message ChatMsg
       * @param [options] Conversion options
       * @returns Plain object
       */
      public static toObject(
        message: im.chat.ChatMsg,
        options?: $protobuf.IConversionOptions,
      ): {[k: string]: any};

      /**
       * Converts this ChatMsg to JSON.
       * @returns JSON object
       */
      public toJSON(): {[k: string]: any};

      /**
       * Gets the default type url for ChatMsg
       * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
       * @returns The default type url
       */
      public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    namespace ChatMsg {
      /** SendType enum. */
      enum SendType {
        NORMAL = 0,
        JOIN = 1,
        LEAVE = 2,
      }

      /** ContentType enum. */
      enum ContentType {
        DEFAULT = 0,
        TEXT = 1,
        IMAGE = 2,
        AUDIO = 3,
        VIDEO = 4,
      }
    }
  }
}
