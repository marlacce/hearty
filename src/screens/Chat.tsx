import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHealth } from '../context/HealthContext';
import { getHeartyResponse, ChatMessage } from '../lib/gemini';
import { Send, Sparkles, User, Info, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function Chat() {
  const { readings } = useHealth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Welcome back! I'm here to help you reflect on your health trends and offer gentle encouragement. How are you feeling today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const response = await getHeartyResponse(input, messages, readings);
    
    setIsTyping(false);
    setMessages(prev => [...prev, {
      role: 'model',
      text: response,
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-180px)]"
    >
      {/* Header Info */}
      <div className="bg-surface-container-low rounded-3xl p-6 mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
          <Sparkles size={24} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-on-surface">Hearty Assistant</h2>
          <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active now</span>
            <span>•</span>
            <span>Non-medical advisor</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar pb-4"
      >
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={cn(
              "flex flex-col max-w-[85%]",
              msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className={cn(
              "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary text-on-primary rounded-tr-none" 
                : "bg-white text-on-surface rounded-tl-none border border-outline-variant/10"
            )}>
              {msg.text}
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant mt-1.5 opacity-50">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start max-w-[85%] mr-auto">
            <div className="p-4 bg-white text-on-surface rounded-2xl rounded-tl-none border border-outline-variant/10 flex items-center gap-2">
              <Loader2 className="animate-spin text-primary" size={16} />
              <span className="text-sm font-medium animate-pulse">Hearty is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
        {['Log Water', 'Feeling Great', 'A bit sore', 'Deep breathing'].map(chip => (
          <button 
            key={chip}
            onClick={() => setInput(chip)}
            className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-full whitespace-nowrap active:scale-95 transition-transform"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="bg-surface-container-high rounded-3xl p-2 flex items-center gap-2 shadow-inner border border-outline-variant/10">
        <button className="p-3 text-on-surface-variant hover:text-primary transition-colors">
          <PlusCircle size={24} />
        </button>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your health update..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 text-sm py-3"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="p-3 bg-primary text-on-primary rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform disabled:opacity-50 disabled:grayscale"
        >
          <Send size={24} />
        </button>
      </div>
    </motion.div>
  );
}

function PlusCircle({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
