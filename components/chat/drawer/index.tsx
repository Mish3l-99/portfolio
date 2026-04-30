"use client";

import { Drawer } from "@mui/material";
import ChatArea from "../ChatArea";
import { useChatStore } from "@/store/chat";

const ChatDrawer = () => {
  const { chatOpen, closeChat } = useChatStore();
  return (
    <Drawer
      open={chatOpen}
      onClose={closeChat}
      anchor="left"
      slotProps={{
        paper: {
          className: "z-999999! w-full! sm:w-120!",
        },
      }}
    >
      <ChatArea />
    </Drawer>
  );
};

export default ChatDrawer;
