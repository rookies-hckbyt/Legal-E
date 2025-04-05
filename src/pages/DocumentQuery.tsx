import { useState, useRef, ChangeEvent, FormEvent, FC } from 'react';
import { 
  Paperclip, 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Send, 
  FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced type definitions with more specificity
type MessageType = 'user' | 'bot';
type FileType = File & { preview?: string };

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: number;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

// Utility function for generating unique IDs
const generateId = (): string => 
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Utility function for formatting file sizes
const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentQuery: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile] = useState<FileType | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [fileId, setFileId] = useState<string | null>(null); // Store the file ID
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const typedFile = selectedFile as FileType;
      typedFile.preview = URL.createObjectURL(selectedFile);

      setFile(typedFile);
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });
      setIsFilePreviewOpen(true);

      // Upload file to API
      uploadFile(selectedFile);
    }
  };

  // Upload file function
  const uploadFile = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/ml/v1/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.file_id) {
        setFileId(data.file_id); // Store the file ID
      } else {
        console.error("File upload failed", data);
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  // Handle chat message submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!inputValue.trim() && !file) return;

    const newMessage: Message = {
      id: generateId(),
      type: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputValue('');

    // Send message to chat API if file ID exists
    if (fileId) {
      await sendMessageToChatAPI(inputValue);
    }
  };

  // Send message to chat API
  const sendMessageToChatAPI = async (message: string): Promise<void> => {
    const requestBody = {
      current_message: message,
      document_id: fileId
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/ml/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      if (data.chat_response) {
        const botResponse: Message = {
          id: generateId(),
          type: 'bot',
          content: data.chat_response,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, botResponse]);
        scrollToBottom();
      } else {
        console.error("Failed to get bot response", data);
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // Scroll to the bottom of the chat
  const scrollToBottom = (): void => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Remove file and reset state
  const removeFile = (): void => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    
    setFile(null);
    setFileInfo(null);
    setIsFilePreviewOpen(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-secondary/10"
    >
      <motion.div 
        layout
        className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out 
          ${isExpanded ? 'w-full h-full' : 'w-[80%] h-[75vh]'}`}
      >
        <div className="flex flex-col h-full">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"
          >
            <h2 className="flex items-center space-x-2 text-2xl font-bold text-primary">
              <FileText className="w-6 h-6 text-primary" />
              <span>Document Query</span>
            </h2>
            <div className="flex space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)} 
                className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
              >
                {isExpanded ? <Minimize2 className="w-5 h-5 text-gray-600" /> : <Maximize2 className="w-5 h-5 text-gray-600" />}
              </motion.button>
              <motion.button 
                whileHover={{ rotate: 180 }}
                onClick={() => setMessages([])} 
                className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>

          <div 
            ref={chatContainerRef} 
            className="flex-1 p-4 space-y-4 overflow-y-auto"
          >
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.type === 'user' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-800'
                    } shadow-sm`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isFilePreviewOpen && fileInfo && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-t border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{fileInfo.name}</span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(fileInfo.size)})
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removeFile}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message here"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 rounded-full transition-colors duration-200 hover:bg-gray-100"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                </label>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={!inputValue.trim() && !file}
                  className={`p-2 rounded-full ${!inputValue.trim() && !file ? 'bg-gray-300' : 'bg-primary'} 
                    text-white`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentQuery;