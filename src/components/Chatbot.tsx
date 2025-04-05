import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import axios, { AxiosError } from 'axios';
import { aiPrompt } from '../ai/aiPrompt';

// Ensure these are properly typed in your environment variables
const API_KEY = import.meta.env.VITE_API_KEY as string;
const API_URL = import.meta.env.VITE_API_URL as string;

// Improved type definitions
type ButtonVariant = 'default' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center text-sm font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-full";
  const variants: Record<ButtonVariant, string> = {
    default: "bg-primary text-white hover:bg-primary-dark",
    ghost: "text-primary hover:bg-secondary",
  };
  const sizes: Record<ButtonSize, string> = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1 text-xs",
    lg: "h-12 px-6 py-3",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex h-10 sm:h-12 w-full rounded-full border border-primary bg-white px-3 sm:px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    />
  );
};

const ThinkingIndicator: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-start"
  >
    <div className="bg-secondary p-2 sm:p-3 rounded-2xl max-w-[70%]">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex items-center text-sm font-medium text-white sm:text-base"
      >
        <svg className="w-4 h-4 mr-2 -ml-1 text-white sm:w-5 sm:h-5 sm:mr-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Thinking...
      </motion.div>
    </div>
  </motion.div>
);

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const LegalAIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions: string[] = [
    "Legal rights",
    "Court procedures",
    "Legal documents",
    "Criminal law",
    "Civil law",
    "Constitutional law",
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `${aiPrompt}\n\nUser query: ${input}`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
    } catch (error) {
      console.error('Error fetching response from API:', error);
      const errorMessage = error instanceof AxiosError 
        ? error.response?.data?.error || error.message
        : 'An unexpected error occurred';
      setMessages(prev => [...prev, { text: `I apologize, there was an error processing your request: ${errorMessage}. Please try again later.`, sender: 'ai' }]);
    }

    setIsLoading(false);
  }, [input]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const containerVariants: Variants = {
    open: (isExpanded) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      width: isExpanded ? '90vw' : '90vw',
      height: isExpanded ? '90vh' : '80vh',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }),
    closed: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div className="fixed z-50 bottom-4 right-4 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            custom={isExpanded}
            className="flex flex-col overflow-hidden bg-white shadow-2xl rounded-3xl max-w-[550px] w-full mx-auto"
            style={{
              boxShadow: '0 10px 25px -5px rgba(200, 155, 0, 0.5), 0 8px 10px -6px rgba(200, 155, 0, 0.3)',
            }}
          >
            <motion.div
              className="flex items-center justify-between p-4 text-white cursor-move sm:p-6 bg-gradient-to-r from-primary to-primary-dark rounded-t-3xl"
              whileHover={{ backgroundImage: 'linear-gradient(to right, #C89B00, #9C7F00)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 text-base font-bold bg-white rounded-full shadow-inner sm:w-12 sm:h-12 sm:text-lg text-primary">
                  AI
                </div>
                <div>
                  <h3 className="text-sm font-semibold sm:text-md">Legal-E Assistant</h3>
                  <p className="text-xs sm:text-sm text-secondary">Your legal guide</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-white hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-black">
                  {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </motion.div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto sm:p-6 bg-gradient-to-b from-background to-white">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 sm:p-4 rounded-2xl shadow-md text-sm sm:text-base ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
                          : 'bg-white text-gray-800 border border-secondary'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && <ThinkingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-background rounded-b-3xl">
              <div className="flex mb-4 space-x-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about legal matters..."
                  className="flex-grow shadow-inner bg-background"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="transition-shadow rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {predefinedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="text-xs transition-colors border rounded-full sm:text-sm border-primary hover:bg-secondary"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="p-3 text-white transition-all rounded-full shadow-lg sm:p-4 bg-gradient-to-r from-primary to-primary-dark hover:shadow-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default LegalAIChatbot;