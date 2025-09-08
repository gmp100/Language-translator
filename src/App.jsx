import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages } from 'lucide-react';
import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import TranslationInput from './components/TranslationInput';
import TranslationOutput from './components/TranslationOutput';
import TranslationHistory from './components/TranslationHistory';
import { TranslationService } from './services/translationService';
import { useTranslationHistory } from './hooks/useTranslationHistory';
import { languages, getLanguageByCode } from './utils/languages';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { history, addTranslation, clearHistory } = useTranslationHistory();

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') return;
    
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText('');
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await TranslationService.translate({
        text: inputText.trim(),
        source: sourceLanguage,
        target: targetLanguage,
      });

      setTranslatedText(response.translatedText);
      
      // Add to history
      const sourceLang = getLanguageByCode(sourceLanguage) || { code: sourceLanguage, name: 'Unknown' };
      const targetLang = getLanguageByCode(targetLanguage) || { code: targetLanguage, name: 'Unknown' };
      
      addTranslation({
        sourceText: inputText.trim(),
        translatedText: response.translatedText,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Translation failed');
      setTranslatedText('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23e5e7eb%22%20stroke-width%3D%221%22%20opacity%3D%220.5%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-20" />
      
      <div className="relative z-10">
        <Navbar />
        
        <motion.main
          className="max-w-4xl mx-auto px-6 py-8 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header */}
          <motion.div
            className="text-center space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="h-[44px] text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Break Language Barriers
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Translate text instantly between multiple languages with our AI-powered translation service
            </p>
          </motion.div>

          {/* Language Selectors */}
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LanguageSelector
              languages={languages}
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              label="From"
            />
            <LanguageSelector
              languages={languages.filter(lang => lang.code !== 'auto')}
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              label="To"
            />
          </motion.div>

          {/* Input Section */}
          <motion.div
            className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <TranslationInput
              inputText={inputText}
              onInputChange={setInputText}
              onSwapLanguages={handleSwapLanguages}
            />
            
            {/* Translate Button */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleTranslate}
                disabled={isLoading || !inputText.trim()}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                <Languages className="w-5 h-5" />
                <span>
                  {isLoading ? 'Translating...' : 'Translate'}
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output Section */}
          <TranslationOutput
            translatedText={translatedText}
            isLoading={isLoading}
            targetLanguage={targetLanguage}
          />

          {/* History Section */}
          <TranslationHistory
            translations={history}
            onClearHistory={clearHistory}
          />
        </motion.main>
      </div>
    </div>
  );
}

export default App;