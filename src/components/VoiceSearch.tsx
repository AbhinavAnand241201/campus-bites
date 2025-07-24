import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface VoiceSearchProps {
  onClose: () => void;
  onResult: (text: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onClose, onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        addToast({
          type: 'info',
          title: 'Voice Search Active',
          message: 'Start speaking to search for food items...'
        });
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addToast({
          type: 'error',
          title: 'Voice Search Error',
          message: 'Unable to recognize speech. Please try again.'
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      addToast({
        type: 'error',
        title: 'Voice Search Not Supported',
        message: 'Your browser does not support voice search.'
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [addToast]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.start();
    }
  };

  const stopListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      recognition.stop();
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Voice Search
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isListening ? 'Listening... Speak now!' : 'Click the microphone to start'}
          </p>
        </div>

        {transcript && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What you said:
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white">{transcript}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {!isListening ? (
            <button
              onClick={startListening}
              className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Listening
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Stop Listening
            </button>
          )}
          
          {transcript && (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceSearch; 