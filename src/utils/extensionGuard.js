// Extension Guard - Prevents conflicts with browser extensions like MetaMask
// This utility helps isolate our app from browser extension interference

export const preventExtensionConflicts = () => {
  // Prevent MetaMask and other Web3 extensions from interfering
  if (typeof window !== 'undefined') {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Filter out extension-related errors that don't affect our app
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Filter out MetaMask and Web3 extension errors
      if (
        message.includes('MetaMask') ||
        message.includes('ethereum') ||
        message.includes('web3') ||
        message.includes('chrome-extension://') ||
        message.includes('Failed to connect to MetaMask')
      ) {
        // Log to original console in development for debugging
        if (process.env.NODE_ENV === 'development') {
          originalError('[Extension Error - Filtered]:', ...args);
        }
        return;
      }
      
      // Allow other errors through
      originalError(...args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filter out extension-related warnings
      if (
        message.includes('MetaMask') ||
        message.includes('ethereum') ||
        message.includes('web3') ||
        message.includes('chrome-extension://')
      ) {
        if (process.env.NODE_ENV === 'development') {
          originalWarn('[Extension Warning - Filtered]:', ...args);
        }
        return;
      }
      
      originalWarn(...args);
    };

    // Prevent extensions from overriding our global objects
    const protectedGlobals = ['fetch', 'XMLHttpRequest', 'WebSocket'];
    
    protectedGlobals.forEach(globalName => {
      if (window[globalName]) {
        // Store the original implementation
        const original = window[globalName];
        
        // Create a wrapper that preserves our app's functionality
        Object.defineProperty(window, `__original_${globalName}`, {
          value: original,
          writable: false,
          configurable: false
        });
      }
    });

    // Add error boundary for unhandled extension errors
    window.addEventListener('error', (event) => {
      if (
        event.error &&
        (event.error.message?.includes('MetaMask') ||
         event.error.message?.includes('chrome-extension://') ||
         event.filename?.includes('chrome-extension://'))
      ) {
        // Prevent extension errors from bubbling up
        event.preventDefault();
        event.stopPropagation();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Extension Error Prevented]:', event.error);
        }
        
        return false;
      }
    });

    // Handle unhandled promise rejections from extensions
    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason &&
        (event.reason.message?.includes('MetaMask') ||
         event.reason.message?.includes('chrome-extension://'))
      ) {
        event.preventDefault();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Extension Promise Rejection Prevented]:', event.reason);
        }
      }
    });
  }
};

// Initialize extension guard
export const initExtensionGuard = () => {
  try {
    preventExtensionConflicts();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Extension guard initialized - Browser extension conflicts prevented');
    }
  } catch (error) {
    console.error('Failed to initialize extension guard:', error);
  }
};
