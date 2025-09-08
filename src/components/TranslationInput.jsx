import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, X } from "lucide-react";

const TranslationInput = ({
  inputText,
  onInputChange,
  onSwapLanguages,
  maxLength = 5000,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [inputText]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with swap */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Enter Text to Translate
        </h2>
        <motion.button
          onClick={onSwapLanguages}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          title="Swap Languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Textarea */}
      <motion.div
        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-blue-500 shadow-lg shadow-blue-500/10"
            : "border-gray-200 dark:border-gray-600"
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter text to translate..."
          maxLength={maxLength}
          className="w-full min-h-[120px] max-h-[250px] p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm resize-none focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        />

        {/* Animated underline */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Clear button */}
        {inputText && (
          <motion.button
            onClick={() => onInputChange("")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
            title="Clear text"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}

        {/* Char counter */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
          {inputText.length}/{maxLength}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TranslationInput;
