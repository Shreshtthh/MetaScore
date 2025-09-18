'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-500/90 border-green-400/50',
  error: 'bg-red-500/90 border-red-400/50',
  warning: 'bg-yellow-500/90 border-yellow-400/50',
  info: 'bg-blue-500/90 border-blue-400/50',
};

export default function Toast({ id, type, title, message, onClose }: ToastProps) {
  const Icon = toastIcons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`max-w-sm w-full backdrop-blur-md rounded-lg border shadow-lg ${toastStyles[type]}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <Icon className="w-5 h-5 text-white mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white">{title}</h4>
            {message && (
              <p className="text-sm text-white/80 mt-1">{message}</p>
            )}
          </div>
          <button
            onClick={() => onClose(id)}
            className="ml-2 p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <X className="w-4 h-4 text-white/80" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
