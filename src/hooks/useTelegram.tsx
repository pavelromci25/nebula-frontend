import { useState, useEffect } from 'react';
import { init, backButton } from '@telegram-apps/sdk';

interface TelegramUser {
  first_name?: string;
  id?: number;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  is_bot?: boolean;
  is_premium?: boolean;
}

interface TelegramChat {
  id: number;
  photo_url?: string;
  type: string;
  title: string;
  username?: string;
}

interface InitDataUnsafe {
  user?: TelegramUser;
  chat?: TelegramChat;
  chat_instance?: string;
  chat_type?: string;
  auth_date?: number;
  hash?: string;
  query_id?: string;
  receiver?: TelegramUser;
  start_param?: string;
}

interface TelegramWebApp {
  expand: () => void;
  initDataUnsafe: InitDataUnsafe;
  platform: string;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  isFullscreen: boolean;
  isOrientationLocked: boolean;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
  openTelegramLink: (url: string) => void; // Добавляем метод openTelegramLink
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [username, setUsername] = useState<string>('Гость');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('Неизвестно');
  const [userId, setUserId] = useState<string>('guest');
  const [isSdkInitialized, setIsSdkInitialized] = useState(false);
  const [isWebAppInitialized, setIsWebAppInitialized] = useState(false);

  // Инициализируем Telegram Web App
  useEffect(() => {
    const initializeWebApp = () => {
      return new Promise<void>((resolve) => {
        const checkWebApp = () => {
          if (window.Telegram?.WebApp) {
            console.log('Telegram Web App already initialized');
            setIsWebAppInitialized(true);
            resolve();
          } else {
            const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
            if (script) {
              const loadHandler = () => {
                console.log('Telegram Web App script loaded');
                setIsWebAppInitialized(true);
                resolve();
              };
              script.addEventListener('load', loadHandler);
            } else {
              console.error('Telegram Web App script not found');
              resolve();
            }
          }
        };

        checkWebApp();
      });
    };

    const loadUserData = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        console.log('Telegram Web App initialized successfully');
        const webApp = window.Telegram.WebApp;
        const initDataUnsafe = webApp.initDataUnsafe;
        const user = initDataUnsafe?.user;

        if (user) {
          setUsername(user.first_name || 'Гость');
          setPhotoUrl(user.photo_url || '');
          setIsPremium(user.is_premium || false);
          setUserId(user.id ? user.id.toString() : 'guest');
        } else {
          setUsername('Гость');
          setUserId('guest');
        }

        setPlatform(webApp.platform || 'Неизвестно');

        console.log('BackButton initial state, isVisible:', backButton.isVisible);
      } else {
        console.error('Telegram Web App not initialized');
      }
    };

    initializeWebApp().then(() => {
      loadUserData();
    });
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      const isMobile = ['ios', 'android'].some((p) => webApp.platform.toLowerCase().includes(p));
      if (isMobile) {
        webApp.requestFullscreen();
        webApp.enableClosingConfirmation();
        webApp.disableVerticalSwipes();
      } else {
        webApp.expand();
      }
      setIsFullscreen(webApp.isFullscreen);

      webApp.onEvent('fullscreenChanged', () => setIsFullscreen(webApp.isFullscreen));
    }
  }, [platform]);

  return {
    isFullscreen,
    username,
    photoUrl,
    isPremium,
    platform,
    userId,
  };
}