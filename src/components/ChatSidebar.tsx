'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/contexts/ChatContext';
import { Plus, MessageSquare, Trash2, Settings, ChevronLeft, ChevronRight, X, Check, Users } from 'lucide-react';

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatSidebar({ isCollapsed, onToggleCollapse }: ChatSidebarProps) {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    createNewConversation,
    deleteConversation,
    isLoading,
  } = useChat();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (confirmingDeleteId === conversationId) {
      handleDeleteConversation(conversationId);
    } else {
      setConfirmingDeleteId(conversationId);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setDeletingId(conversationId);
    setConfirmingDeleteId(null);
    try {
      await deleteConversation(conversationId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const isConsensusConversation = (model: string) => {
    return model.startsWith('consensus:');
  };

  return (
    <>
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-4 top-4 z-50 flex flex-col gap-2"
          >
            <div className="relative group/expand">
              <motion.button
                onClick={onToggleCollapse}
                className="cursor-pointer w-10 h-10 bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-lg transition-colors text-white/50 hover:text-white/80 border border-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={16} />
              </motion.button>
              
               <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/expand:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                 Expand Sidebar
               </div>
            </div>

            <div className="relative group/newchat">
              <motion.button
                onClick={() => {
                  createNewConversation();
                  window.history.replaceState(null, '', '/chat');
                }}
                className="cursor-pointer w-10 h-10 bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-lg transition-colors text-white/70 hover:text-white/90 border border-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={16} />
              </motion.button>
              
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/newchat:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  New Chat
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -256, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 256 }}
            exit={{ opacity: 0, x: -256, width: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-black/20 backdrop-blur-sm border-r border-white/5 flex flex-col h-full overflow-hidden"
          >
            {isLoading ? (
              <motion.div 
                className="p-4 flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="h-8 bg-white/5 rounded-lg animate-pulse"></div>
                  <div className="space-y-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="h-12 bg-white/5 rounded-md animate-pulse"
                      ></motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="p-4 border-b border-white/5 flex items-center gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={() => {
                      createNewConversation();
                      window.history.replaceState(null, '', '/chat');
                    }}
                    className="cursor-pointer flex-1 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 h-8 text-xs font-medium rounded-md transition-colors text-white/70 hover:text-white/90"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Plus size={14} />
                    New Chat
                  </motion.button>

                  <div className="relative group/collapse">
                    <motion.button
                      onClick={onToggleCollapse}
                      className="cursor-pointer w-8 h-8 bg-white/5 hover:bg-white/10 flex items-center justify-center rounded-md transition-colors text-white/50 hover:text-white/80"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ChevronLeft size={14} />
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex-1 overflow-y-auto p-2 space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <AnimatePresence mode="popLayout">
                    {conversations.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.5 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6, type: "spring" }}
                        >
                          <MessageSquare size={20} className="text-white/20 mx-auto mb-2" />
                        </motion.div>
                        <motion.p 
                          className="text-white/40 text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          No conversations
                        </motion.p>
                      </motion.div>
                    ) : (
                      conversations.map((conversation, index) => (
                        <motion.div
                          key={conversation.id}
                          layout
                          initial={{ opacity: 0, y: 20, x: -20 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          exit={{ opacity: 0, x: -20, scale: 0.9 }}
                          transition={{ 
                            delay: 0.5 + index * 0.05,
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          onClick={() => {
                            if (deletingId !== conversation.id) {
                              setActiveConversation(conversation);
                              window.history.replaceState(null, '', `/chat/${conversation.id}`);
                            }
                          }}
                          className={`group p-2 rounded-md transition-colors relative ${
                            deletingId === conversation.id
                              ? 'cursor-not-allowed opacity-50'
                              : 'cursor-pointer'
                          } ${
                            activeConversation?.id === conversation.id
                              ? 'bg-white/10 text-white/90'
                              : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                          }`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {activeConversation?.id === conversation.id && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/60 rounded-r-sm"
                              initial={{ opacity: 0, scaleY: 0 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}

                          <div className="flex items-center justify-between pl-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  {isConsensusConversation(conversation.model) && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.1 }}
                                      className="flex-shrink-0 relative group/consensus"
                                    >
                                      <div className="w-4 h-4 bg-purple-500/20 border border-purple-400/30 rounded-full flex items-center justify-center">
                                        <Users size={8} className="text-purple-400" />
                                      </div>
                                      
                                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover/consensus:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                        Multi-Model Consensus Chat
                                      </div>
                                    </motion.div>
                                  )}
                                  <h3 className="text-xs font-medium truncate mb-1">
                                    {conversation.title}
                                  </h3>
                                </div>
                                {deletingId === conversation.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1"
                                  >
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="w-3 h-3 border border-red-400/60 border-t-transparent rounded-full"
                                    />
                                    <span className="text-[10px] text-red-400/80 font-medium">
                                      Deleting...
                                    </span>
                                  </motion.div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs opacity-50">
                                  {formatDate(conversation.updated_at)}
                                </p>
                                {isConsensusConversation(conversation.model) && (
                                  <span className="text-[10px] text-purple-400/60 font-medium">
                                    {(() => {
                                      // Extract the models part after 'consensus:'
                                      const modelsString = conversation.model.replace('consensus:', '');
                                      const modelCount = modelsString ? modelsString.split(',').length : 0;
                                      return modelCount > 0 ? `${modelCount} Models` : 'Consensus';
                                    })()}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {confirmingDeleteId === conversation.id ? (
                                <>
                                  <motion.button
                                    onClick={(e) => handleDeleteClick(e, conversation.id)}
                                    disabled={deletingId === conversation.id}
                                    className={`p-1.5 rounded transition-colors ${
                                      deletingId === conversation.id
                                        ? 'bg-red-500/10 cursor-not-allowed'
                                        : 'cursor-pointer bg-red-500/20 hover:bg-red-500/30'
                                    }`}
                                    whileHover={deletingId === conversation.id ? {} : { scale: 1.05 }}
                                    whileTap={deletingId === conversation.id ? {} : { scale: 0.95 }}
                                  >
                                    {deletingId === conversation.id ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border border-white/40 border-t-transparent rounded-full"
                                      />
                                    ) : (
                                      <Check size={14} className="text-red-400" />
                                    )}
                                  </motion.button>
                                  {deletingId !== conversation.id && (
                                    <motion.button
                                      onClick={handleCancelDelete}
                                      className="cursor-pointer p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <X size={14} className="text-white/60" />
                                    </motion.button>
                                  )}
                                </>
                              ) : (
                                <motion.button
                                  onClick={(e) => handleDeleteClick(e, conversation.id)}
                                  disabled={deletingId === conversation.id}
                                  className="cursor-pointer opacity-0 group-hover:opacity-60 hover:opacity-100 p-1.5 transition-opacity rounded hover:bg-red-500/20"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 size={14} className="text-white/60" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div 
                  className="p-4 border-t border-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/settings">
                    <motion.div
                      className="w-full flex items-center gap-2 text-white/50 hover:text-white/80 px-2 py-2 rounded-md hover:bg-white/5 transition-colors text-xs"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Settings size={14} />
                      Settings
                    </motion.div>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 