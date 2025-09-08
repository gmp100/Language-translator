import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const LanguageSelector = ({
  languages = [],
  selectedLanguage,
  onLanguageChange,
  label,
  disabled = false,
  showDefaultOption = false,
}) => {
  const selectId = `language-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
        >
          {showDefaultOption && (
            <option value="" disabled>
              Select a language...
            </option>
          )}

          {languages.length > 0 ? (
            languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))
          ) : (
            <option disabled>No languages available</option>
          )}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
