import React, { useState, useEffect, useRef } from 'react';
import { getInitialMessage, getNextMessage, type Message } from '../services/ai/ConversationEngine';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Link } from 'react-router-dom';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    const startConversation = async () => {
      try {
        const initialMessage = await getInitialMessage();
        setMessages([initialMessage]);
      } catch (error) {
        console.error("Failed to start conversation:", error);
        setMessages([{ role: 'assistant', content: "I'm having a little trouble connecting right now. Please try refreshing the page." }]);
      } finally {
        setIsLoading(false);
      }
    };
    startConversation();
  }, []);

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const aiResponse = await getNextMessage([...messages, userMessage]);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to get next message:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "My apologies, I seem to have lost my train of thought. Could you say that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-base text-text-primary transition-colors duration-500 ease-soft dark:bg-[radial-gradient(circle,var(--color-bg-surface)_0%,var(--color-bg-base)_100%)]">
      <header className="flex justify-between items-center p-4 text-center border-b border-border-subtle backdrop-blur-sm bg-bg-base/50 sticky top-0 z-10">
        <Link to="/" className="text-lg font-medium text-text-secondary hover:text-text-primary transition-colors">
          &larr; Home
        </Link>
        <h1 className="text-2xl font-medium text-text-primary">Your Kapsulle</h1>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-end gap-3 max-w-full animate-bubble-in" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              className={`max-w-lg p-4 rounded-2xl shadow-md border border-border-subtle ${
                msg.role === 'user'
                  ? 'bg-accent-primary text-cream dark:text-russet rounded-br-lg'
                  : 'bg-bg-surface/80 text-text-primary rounded-bl-lg'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2 p-4 bg-bg-surface/80 rounded-2xl rounded-bl-lg shadow-md border border-border-subtle">
                <div className="w-2 h-2 bg-text-secondary/70 rounded-full animate-pulse-dot" style={{ animationDelay: '-0.32s' }}></div>
                <div className="w-2 h-2 bg-text-secondary/70 rounded-full animate-pulse-dot" style={{ animationDelay: '-0.16s' }}></div>
                <div className="w-2 h-2 bg-text-secondary/70 rounded-full animate-pulse-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-3 sm:p-4 border-t border-border-subtle bg-bg-base/50 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            rows={1}
            className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-border-default text-text-primary placeholder-text-secondary/70 focus:border-accent-primary focus:ring-2 focus:ring-peach focus:outline-none transition-all duration-200 ease-soft resize-none leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-accent-primary text-cream dark:text-russet font-bold disabled:bg-accent-primary/50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 transition-all duration-300 ease-gentle-spring"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}