import { ChatComponent } from '@/components/chat/ChatComponent';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chat with Claude</h1>
      <ChatComponent />
    </div>
  );
}
