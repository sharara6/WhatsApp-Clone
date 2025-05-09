import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import AudioMessageBubble from "./Chat/AudioMessageBubble";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser.id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser.id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollToBottom = () => {
        container.scrollTop = container.scrollHeight;
      };
      
      // Use requestAnimationFrame to ensure the DOM is updated
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'audio':
        return (
          <AudioMessageBubble
            audioUrl={message.content}
            isOwnMessage={message.sender_id === authUser.id}
          />
        );
      case 'image':
        return (
          <>
            <img
              src={message.content}
              alt="Attachment"
              className="sm:max-w-[200px] rounded-md mb-2"
            />
            {message.text && <p>{message.text}</p>}
          </>
        );
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.sender_id === authUser.id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender_id === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.created_at)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
