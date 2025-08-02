import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabase } from '@/hooks/use-supabase';
import { useUser } from '@supabase/auth-helpers-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatProps {
  bookingId: string;
}

const Chat: React.FC<ChatProps> = ({ bookingId }) => {
  const {
    messages,
    fetchMessages,
    sendMessage,
    subscribeToMessages,
    isFetchingMessages,
    isSendingMessage
  } = useSupabase();
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const currentUserId = user?.id;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      const scrollElement = scrollAreaRef.current?.children[1];
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (!bookingId || !currentUserId) return;

    fetchMessages(bookingId);
    const channel = subscribeToMessages(bookingId);
    scrollToBottom();

    return () => {
      console.log(`Unsubscribing from messages for booking ${bookingId}`);
      channel.unsubscribe();
    };
  }, [bookingId, currentUserId, fetchMessages, subscribeToMessages, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !currentUserId || !bookingId) return;

    await sendMessage(bookingId, newMessage);
    setNewMessage('');
  };

  if (!currentUserId) {
    return <div className="p-4 text-center text-muted-foreground">Authenticating...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <ScrollArea className="flex-grow h-64 border rounded-md p-2" ref={scrollAreaRef}>
        {isFetchingMessages ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground p-4">
            No messages yet. Start the conversation!
          </p>
        ) : (
          <div className="space-y-3 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[75%] p-2 px-3 rounded-lg",
                  msg.sender_id === currentUserId
                    ? "bg-primary text-primary-foreground self-end items-end"
                    : "bg-muted text-muted-foreground self-start items-start"
                )}
              >
                <p className="text-sm break-words">{msg.message}</p>
                <span className="text-xs opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isSendingMessage}
          className="flex-grow"
        />
        <Button type="submit" disabled={isSendingMessage || !newMessage.trim()} size="icon">
          {isSendingMessage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
};

export default Chat; 