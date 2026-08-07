import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isStandalone = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowInstall(true);
    }

    // Handle standard beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If already installed (PWA window), hide install options
    const handleAppInstalled = () => {
      setShowInstall(false);
      setDeferredPrompt(null);
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    });
  };

  if (!showInstall) return null;

  return (
    <>
      <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center z-10">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white pl-4 pr-6 py-1.5 sm:pl-5 sm:pr-8 sm:py-2 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse transition-all"
          title="Install App"
        >
          <Download size={16} />
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Install App</span>
        </button>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowIOSInstructions(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowIOSInstructions(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <div className="text-center text-dark">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">Install App on iOS</h3>
              <p className="text-gray-600 text-sm mb-6">
                Install this app on your iPhone or iPad for the best experience.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3">
                <p className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-white border rounded-full flex items-center justify-center font-bold text-xs">1</span>
                  Tap the <Share size={16} className="text-blue-500 mx-1" /> Share button in Safari
                </p>
                <p className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-white border rounded-full flex items-center justify-center font-bold text-xs">2</span>
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                </p>
                <p className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-white border rounded-full flex items-center justify-center font-bold text-xs">3</span>
                  Tap <strong>"Add"</strong> in the top right corner
                </p>
              </div>
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
