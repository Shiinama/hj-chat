/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from 'protobufjs/light';

const $root = (
  $protobuf.roots.default || ($protobuf.roots.default = new $protobuf.Root())
).addJSON({
  im: {
    nested: {
      chat: {
        nested: {
          ChatService: {
            methods: {
              SendChatMsg: {
                requestType: 'ChatMsgReq',
                responseType: 'ChatMsgResp',
              },
            },
          },
          ChatMsgReq: {
            fields: {
              msg: {
                type: 'ChatMsg',
                id: 1,
              },
            },
          },
          ChatMsgResp: {
            fields: {
              msg: {
                type: 'ChatMsg',
                id: 1,
              },
            },
          },
          ReceiverType: {
            values: {
              RECEIVER_INVALID: 0,
              GROUP: 1,
              USER: 2,
            },
          },
          ChatMsg: {
            oneofs: {
              _id: {
                oneof: ['id'],
              },
              _replyChatMsgId: {
                oneof: ['replyChatMsgId'],
              },
            },
            fields: {
              id: {
                type: 'string',
                id: 1,
                options: {
                  proto3_optional: true,
                },
              },
              sendType: {
                type: 'ChatMsg.SendType',
                id: 2,
              },
              sender: {
                type: 'string',
                id: 3,
              },
              receiverType: {
                type: 'ReceiverType',
                id: 4,
              },
              receiver: {
                type: 'string',
                id: 5,
              },
              time: {
                type: 'int64',
                id: 6,
              },
              contentType: {
                type: 'ContentType',
                id: 7,
              },
              content: {
                type: 'string',
                id: 8,
              },
              replyChatMsgId: {
                type: 'string',
                id: 9,
                options: {
                  proto3_optional: true,
                },
              },
            },
            nested: {
              SendType: {
                values: {
                  NORMAL: 0,
                  JOIN: 1,
                  LEAVE: 2,
                },
              },
              ContentType: {
                values: {
                  DEFAULT: 0,
                  TEXT: 1,
                  IMAGE: 2,
                  AUDIO: 3,
                  VIDEO: 4,
                },
              },
            },
          },
        },
      },
    },
  },
});

export {$root as default};
