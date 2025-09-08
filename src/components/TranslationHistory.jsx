import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Copy, Trash2, CheckCircle } from "lucide-react"; // CheckCircle use kar

const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return timestamp.toLocaleDateString();
};

const TranslationHistory = ({ translations, onClearHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyTranslation = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  if (translations.length === 0) return null;

  return (
    <motion.div
      className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">
            Recent Translations ({translations.length})
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </motion.div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/20"
          >
            <div className="p-4 space-y-3">
              {/* Clear Button */}
              <div className="flex justify-end">
                <motion.button
                  onClick={onClearHistory}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-600 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear History</span>
                </motion.button>
              </div>

              {/* Translation List */}
              {translations.map((translation, index) => (
                <motion.div
                  key={translation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="bg-white/60 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {translation.sourceLanguage.name} →{" "}
                      {translation.targetLanguage.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(translation.timestamp)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {translation.sourceText}
                    </p>
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-800 font-medium flex-1">
                        {translation.translatedText}
                      </p>
                      <motion.button
                        onClick={() =>
                          handleCopyTranslation(
                            translation.id,
                            translation.translatedText
                          )
                        }
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedId === translation.id ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TranslationHistory;
