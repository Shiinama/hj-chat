import { Toast as xiaoshuToast } from "@fruits-chain/react-native-xiaoshu";
import { ToastProps } from "@fruits-chain/react-native-xiaoshu/lib/typescript/toast/interface";
export const Toast = (props: ToastProps | string) => {
  // Toast('Update successfully!')
  let toastArgs: ToastProps = {
    position: "top",
  };
  if (typeof props === "string") {
    toastArgs = {
      message: props,
      ...toastArgs,
    };
  } else {
    toastArgs = {
      ...toastArgs,
      ...props,
    };
  }

  return xiaoshuToast(toastArgs);
};
