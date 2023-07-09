import * as Updates from "expo-updates";
import { useState } from "react";

const useUpdateChecker = () => {
  const [newSoftUpdate, setNewSoftUpdate] = useState(false);

  const eventListener = (event: Updates.UpdateEvent) => {
    if (event.type === Updates.UpdateEventType.ERROR) {
    } else if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
      setNewSoftUpdate(false);
    } else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      setNewSoftUpdate(true);
    }
  };

  Updates.useUpdateEvents(eventListener);

  return { newSoftUpdate };
};

export default useUpdateChecker;
