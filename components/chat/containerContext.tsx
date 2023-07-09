import React from "react";
export const ContainerChatContext = React.createContext({} as any);

export const useChatContext = () => React.useContext(ContainerChatContext);
