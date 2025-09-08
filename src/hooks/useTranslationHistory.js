import { useState, useEffect } from 'react';

const HISTORY_KEY = 'translation-history';
const MAX_HISTORY_SIZE = 5;

export const useTranslationHistory = () => {
  const [history, setHistory] = useState([]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(parsedHistory);
      } catch (error) {
        console.error('Failed to parse translation history:', error);
      }
    }
  }, []);

  // Auto-sync with localStorage whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } else {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, [history]);

  const addTranslation = (translation) => {
    const newTranslation = {
      ...translation,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setHistory((prevHistory) =>
      [newTranslation, ...prevHistory]
        .sort((a, b) => b.timestamp - a.timestamp) //Ensure newest first
        .slice(0, MAX_HISTORY_SIZE)
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addTranslation,
    clearHistory,
  };
};
