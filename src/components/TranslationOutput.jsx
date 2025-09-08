import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Volume2, CheckCircle, Loader2 } from 'lucide-react';

const TranslationOutput = ({
  translatedText,
  isLoading,
  targetLanguage,
}) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Copy to clipboard
  const handleCopy = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Text-to-Speech with auto-cancel + matching voice
  const handleSpeak = () => {
    if (!translatedText) return;

    // Stop any previous speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLanguage;
    utterance.rate = 0.9;

    // Pick matching voice if available
    const voices = speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLanguage));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      layout
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Translation
        </h3>
        
        {(translatedText && !isLoading) && (
          <motion.div
            className="flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Copy button */}
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg transition-all duration-200 group"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
              )}
            </motion.button>
            
            {/* Speak button */}
            <motion.button
              onClick={handleSpeak}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg transition-all duration-200 group ${
                speaking ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`}
              title="Text to speech"
              disabled={speaking}
            >
              {speaking ? (
                <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-white" />
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
      
      {/* Output box */}
      <motion.div
        className="min-h-[120px] bg-white/60 dark:bg-gray-900/70 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
        layout
      >
        {isLoading ? (
          <motion.div
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
            <span className="text-gray-600 dark:text-gray-300">Translating...</span>
          </motion.div>
        ) : translatedText ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={translatedText} // ✅ ensures animation on change
              className="text-gray-800 dark:text-gray-100 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {translatedText}
            </motion.p>
          </AnimatePresence>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            Translation will appear here...
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TranslationOutput;
