/**
 * [基础样式表]
 */
export default {
  bottomBorder: {
    borderBottomColor: '#e5e5e5',
  },
  // flex-水平垂直居中
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // flex-垂直不居中
  flexAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // flex-垂直两端对齐
  flexSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // 字体很大的描述内容
  descriptionLargeFont: {
    fontSize: 20,
  },
  // 带input的描述文案
  descriptionInputLabelText: {
    lineHeight: 32,
    marginVertical: 4,
  },
  deletableIconLayout: {
    position: 'absolute',
    right: 12,
    top: 16,
    zIndex: 1,
  },
} as any
