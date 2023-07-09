import Slider, { SliderProps } from "@react-native-community/slider";
import { useControllableValue } from "ahooks";
import { FC, useRef } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

import Enlarge from "../../assets/images/profile/enlarge.svg";
import Shrink from "../../assets/images/profile/shrink.svg";
import sliderIcon from "../../assets/images/profile/slider.png";

export type CustomSliderProps = SliderProps;
const CustomSlider: FC<CustomSliderProps> = (props) => {
  const ref = useRef(null);
  const addStep = () => {
    const resVal = props?.value + 0.1;
    props?.onValueChange(
      resVal > props?.maximumValue ? props?.maximumValue : resVal,
    );
  };
  const minusStep = () => {
    const resVal = props?.value - 0.1;
    props?.onValueChange(
      resVal < props?.minimumValue ? props?.minimumValue : resVal,
    );
  };
  return (
    <View style={styles.wrap}>
      <TouchableOpacity onPress={minusStep}>
        <Shrink />
      </TouchableOpacity>
      <Slider
        ref={ref}
        maximumValue={1}
        minimumValue={0}
        step={0.1}
        style={[
          styles.slider,
          Platform.OS === "ios" ? { marginHorizontal: 16 } : {},
        ]}
        tapToSeek={true}
        thumbImage={sliderIcon}
        maximumTrackTintColor="#F1EAFE"
        minimumTrackTintColor="#F1EAFE"
        {...props}
      />
      <TouchableOpacity onPress={addStep}>
        <Enlarge />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  slider: {
    width: "100%",
    flexShrink: 1,
    flexGrow: 1,
  },
});
export default CustomSlider;
