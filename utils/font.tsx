import { Text, Platform } from "react-native";
export const setCustomText = () => {
  const TextRender = Text.render;

  let customStyle = {};
  if (Platform.OS === "android")
    customStyle = {
      fontFamily: "",
    };
  //更改组件样式
  Text.render = function render(props) {
    let oldProps = props;
    props = { ...props, style: [customStyle, props.style] };
    try {
      return TextRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
  //更改组件属性
  Text.defaultProps = Object.assign({}, Text.defaultProps, {
    maxFontSizeMultiplier: 1.15,
    textBreakStrategy: "simple",
  });
};
