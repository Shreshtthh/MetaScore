'use client';

import { toast as hotToast } from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export function useToast() {
  const toast = {
    success: (message: string, options?: ToastOptions) => {
      return hotToast.success(message, {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
        style: {
          background: '#10b981',
          color: '#ffffff',
          borderRadius: '8px',
        },
      });
    },
    
    error: (message: string, options?: ToastOptions) => {
      return hotToast.error(message, {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
        style: {
          background: '#ef4444',
          color: '#ffffff',
          borderRadius: '8px',
        },
      });
    },
    
    loading: (message: string, options?: ToastOptions) => {
      return hotToast.loading(message, {
        position: options?.position || 'top-right',
        style: {
          background: '#6366f1',
          color: '#ffffff',
          borderRadius: '8px',
        },
      });
    },
    
    info: (message: string, options?: ToastOptions) => {
      return hotToast(message, {
        duration: options?.duration || 4000,
        position: options?.position || 'top-right',
        icon: 'ℹ️',
        style: {
          background: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
        },
      });
    },
    
    dismiss: (toastId?: string) => {
      if (toastId) {
        hotToast.dismiss(toastId);
      } else {
        hotToast.dismiss();
      }
    },
    
    promise: <T,>(
      promise: Promise<T>,
      messages: {
        loading: string;
        success: string;
        error: string;
      },
      options?: ToastOptions
    ) => {
      return hotToast.promise(
        promise,
        messages,
        {
          position: options?.position || 'top-right',
          style: {
            borderRadius: '8px',
          },
        }
      );
    },
  };

  return toast;
}
