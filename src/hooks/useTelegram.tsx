import { useState, useEffect } from 'react';
import { init } from '@telegram-apps/sdk';

// Extend the Window interface to include TelegramWebviewProxy
declare global {
  interface Window {
    TelegramWebviewProxy?: any;
    referrals?: string[];
  }
}

// Интерфейс для данных пользователя
interface TelegramUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  coins?: number;
  stars?: number;
  referrals?: string[];
}

// Интерфейс для SDK
interface TelegramSDK {
  ready: () => void;
  expand: () => void;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };
  };
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    try {
      const isTMA = () => typeof window !== 'undefined' && !!window.TelegramWebviewProxy;
      const sdk = isTMA() ? init() : {
        ready: () => console.log('Mock ready called'),
        expand: () => console.log('Mock expand called'),
        initDataUnsafe: {
          user: {
            id: 123,
            first_name: 'Test',
            username: 'test_user',
          },
        },
      };
  
      if (typeof sdk !== 'function' && typeof sdk.ready === 'function') {
        sdk.ready();
      } else {
        console.warn('Метод ready не найден в SDK');
      }
  
      const telegramUser = typeof sdk !== 'function' ? sdk.initDataUnsafe?.user : undefined;
      if (telegramUser) {
        setUserData({
          id: String(telegramUser.id),
          username: telegramUser.username || 'Гость',
          coins: 0,
          stars: 0,
          referrals: [],
          photoUrl: '',
        });
      }
    } catch (e) {
      console.error('Ошибка инициализации Telegram SDK:', e);
    }
  }, []);

  return {
    user: userData,
    isReady,
    isFullscreen,
  };
}