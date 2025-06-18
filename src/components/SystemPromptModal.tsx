'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Save } from 'lucide-react';

interface SystemPromptModalProps {
  isOpen: boolean;
  initialPrompt: string;
  onClose: () => void;
  onSave: (prompt: string) => void;
}

export function SystemPromptModal({ isOpen, initialPrompt, onClose, onSave }: SystemPromptModalProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSave = () => {
    onSave(prompt);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass-strong rounded-3xl max-w-lg w-full p-8 relative border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-purple-500/10 rounded-3xl" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center">
                  <Sparkles size={20} className="text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">System Prompt</h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 glass-hover rounded-2xl text-white/60 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter system prompt..."
              className="w-full h-40 input-glass text-white p-3 mb-6 relative z-10"
            />

            <div className="flex justify-end gap-3 relative z-10">
              <button onClick={onClose} className="btn-ghost px-6 py-3">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary px-6 py-3 flex items-center gap-2">
                <Save size={16} />
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
