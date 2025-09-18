import { Variants } from 'framer-motion';

// Basic animation variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

export const scaleSpring: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { opacity: 0, scale: 0.8 }
};

// Stagger animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Card animations
export const cardHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { scale: 0.98 }
};

export const cardFloat: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Button animations
export const buttonPress: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.95 },
  hover: { scale: 1.05 }
};

export const buttonGlow: Variants = {
  initial: { boxShadow: "0 0 0px rgba(99, 102, 241, 0)" },
  hover: { 
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
    transition: { duration: 0.3 }
  }
};

// Loading animations
export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const bounce: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress animations
export const progressFill: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  })
};

export const countUp = (target: number) => ({
  initial: { value: 0 },
  animate: { 
    value: target,
    transition: {
      duration: 2,
      ease: "easeOut"
    }
  }
});

// Modal animations
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalContent: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
    y: 20 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.3
    }
  }
};

// Tier progression animations
export const tierGlow = (color: string): Variants => ({
  animate: {
    boxShadow: [
      `0 0 5px ${color}40`,
      `0 0 20px ${color}60`,
      `0 0 5px ${color}40`
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
});

export const scoreIncrement: Variants = {
  initial: { scale: 1, color: "#ffffff" },
  animate: { 
    scale: [1, 1.2, 1],
    color: ["#ffffff", "#00ff00", "#ffffff"],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Chart animations
export const chartLine: Variants = {
  initial: { pathLength: 0 },
  animate: { 
    pathLength: 1,
    transition: {
      duration: 2,
      ease: "easeInOut"
    }
  }
};

export const chartBar = (delay: number): Variants => ({
  initial: { scaleY: 0 },
  animate: { 
    scaleY: 1,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeOut"
    }
  }
});

// Notification animations
export const slideInRight: Variants = {
  initial: { x: 300, opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    x: 300, 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Custom easing functions
export const easeInOutCubic = [0.645, 0.045, 0.355, 1];
export const easeOutBack = [0.175, 0.885, 0.32, 1.275];
export const easeInOutBack = [0.68, -0.55, 0.265, 1.55];

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  // Cards
  cardEntry: {
    variants: slideUp,
    initial: "initial",
    animate: "animate",
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  // Buttons
  buttonInteraction: {
    variants: buttonPress,
    initial: "initial",
    whileHover: "hover",
    whileTap: "tap"
  },
  
  // Modals
  modalEntry: {
    variants: modalContent,
    initial: "initial",
    animate: "animate",
    exit: "exit"
  },
  
  // Pages
  pageEntry: {
    variants: pageTransition,
    initial: "initial",
    animate: "animate",
    exit: "exit"
  }
};

// Helper function to create stagger animations
export const createStaggerAnimation = (
  childVariant: Variants = staggerItem,
  staggerDelay: number = 0.1
): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

// Helper function for delayed animations
export const withDelay = (variants: Variants, delay: number): Variants => {
  const newVariants: Variants = {};
  
  Object.keys(variants).forEach(key => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null && 'transition' in variant) {
      newVariants[key] = {
        ...variant,
        transition: {
          ...variant.transition,
          delay: (variant.transition?.delay || 0) + delay
        }
      };
    } else {
      newVariants[key] = variant;
    }
  });
  
  return newVariants;
};

// Hook for responsive animations
export const useResponsiveAnimation = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  return {
    duration: isMobile ? 0.3 : 0.5,
    ease: "easeOut",
    reducedMotion: isMobile
  };
};
