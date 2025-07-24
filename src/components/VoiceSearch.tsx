import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Search, Volume2, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onSearch, isListening, setIsListening }) => {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const { addToast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        onSearch(result);
        setIsListening(false);
        addToast({
          type: 'success',
          title: 'Voice Search Complete',
          message: `Searching for: "${result}"`
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addToast({
          type: 'error',
          title: 'Voice Search Error',
          message: 'Could not recognize speech. Please try again.'
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onSearch, setIsListening, addToast]);

  const startListening = () => {
    if (!isSupported) {
      addToast({
        type: 'error',
        title: 'Not Supported',
        message: 'Voice search is not supported in your browser.'
      });
      return;
    }

    try {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript('');
      addToast({
        type: 'info',
        title: 'Listening...',
        message: 'Speak now to search for food items'
      });
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 left-0 right-0 bg-gradient-to-r from-primary-500 to-purple-600 text-white p-4 rounded-lg shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="w-6 h-6" />
                </motion.div>
                <div>
                  <p className="font-medium">Listening...</p>
                  <p className="text-sm opacity-90">Speak to search for food items</p>
                </div>
              </div>
              <button
                onClick={stopListening}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {transcript && (
            <button
              onClick={clearTranscript}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-lg transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <MicOff className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="not-listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Mic className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Voice input: "{transcript}"
        </motion.div>
      )}
    </div>
  );
};

export default VoiceSearch; 