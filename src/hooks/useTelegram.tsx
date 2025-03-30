import { useState, useEffect } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

// Тип для данных пользователя
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

// Тип для данных чата (если есть)
interface TelegramChat {
  id: number;
  photo_url?: string;
  type: string;
  title: string;
  username?: string;
}

// Тип для initDataUnsafe (необязательный)
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

// Полный тип для результата retrieveLaunchParams
interface LaunchParams {
  initDataUnsafe?: InitDataUnsafe;
  tgWebAppBotInline?: boolean;
  tgWebAppData?: string | {
    auth_date: Date;
    can_send_after?: number;
    chat?: TelegramChat;
    chat_instance?: string;
    chat_type?: string;
    hash?: string;
    query_id?: string;
    receiver?: TelegramUser;
    start_param?: string;
    user?: TelegramUser;
  };
  tgWebAppDebug?: boolean;
  tgWebAppPlatform?: string;
  tgWebAppShowSettings?: boolean;
  tgWebAppThemeParams?: Record<string, string>;
  tgWebAppVersion?: string;
}

// Интерфейс для Telegram Web App
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
  setOrientationLock?: (lock: 'portrait' | 'landscape') => void;
  setOrientationUnlock?: () => void;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
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
  const [debugMessage, setDebugMessage] = useState<string>('Инициализация Telegram SDK...');
  const [debugPlatform, setDebugPlatform] = useState<string>('Ожидание платформы...');
  const [apiVersion, setApiVersion] = useState<string>('Неизвестно');
  const [userId, setUserId] = useState<string>('guest'); // Добавлено

  useEffect(() => {
    const loadUserData = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        try {
          const initDataUnsafe = webApp.initDataUnsafe;
          const user = initDataUnsafe?.user;

          if (user) {
            setUsername(user.first_name || 'Гость');
            setPhotoUrl(user.photo_url || '');
            setIsPremium(user.is_premium || false);
            setUserId(user.id ? user.id.toString() : 'guest'); // Добавлено
          } else {
            setUsername('Гость');
            setUserId('guest');
          }

          setPlatform(webApp.platform || 'Неизвестно');
          setDebugPlatform(`Получена платформа: ${webApp.platform || 'Неизвестно'}`);
          setDebugMessage('Telegram SDK запущен, подключение удачное');
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          setDebugMessage('Ошибка загрузки данных пользователя: ' + errorMessage);
          setUsername('Гость');
          setPhotoUrl('');
          setIsPremium(false);
          setPlatform('Неизвестно');
          setDebugPlatform('Ошибка платформы');
          setApiVersion('Неизвестно');
          setUserId('guest');
        }
      } else {
        setDebugMessage('Telegram SDK не запущен (не в среде Telegram)');
        setDebugPlatform('Telegram Web App недоступен');
        setApiVersion('Неизвестно');
        setUserId('guest');
      }
    };

    loadUserData();

    const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
    if (script && !window.Telegram?.WebApp) {
      const loadHandler = () => loadUserData();
      script.addEventListener('load', loadHandler);
      const timeout = setTimeout(() => {
        if (!window.Telegram?.WebApp) {
          setDebugMessage('Telegram SDK не загрузился');
          setDebugPlatform('Скрипт не загрузился');
        }
      }, 5000);
      return () => {
        script.removeEventListener('load', loadHandler);
        clearTimeout(timeout);
      };
    }
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const webApp = window.Telegram.WebApp;
      try {
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
        webApp.onEvent('fullscreenFailed', () => {
          setDebugMessage('Не удалось включить полноэкранный режим');
        });
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setDebugMessage('Ошибка настройки полноэкранного режима: ' + errorMessage);
      }
    }
  }, [platform]);

  return {
    isFullscreen,
    username,
    photoUrl,
    isPremium,
    platform,
    debugMessage,
    debugPlatform,
    apiVersion,
    userId, // Добавлено
  };
}