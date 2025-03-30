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

// Интерфейс для Telegram Web App с новыми свойствами и методами API 8.0
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
  setOrientationLock: (lock: 'portrait' | 'landscape') => void;
  setOrientationUnlock: () => void;
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

  useEffect(() => {
    const initializeTelegram = () => {
      console.log('Проверка window.Telegram:', window.Telegram);
      if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        try {
          console.log('Вызываем expand() или requestFullscreen()');
          // Проверяем платформу и применяем соответствующий метод
          if (webApp.platform === 'ios' || webApp.platform === 'android') {
            // Для iOS и Android используем requestFullscreen из API 8.0
            webApp.requestFullscreen();
            // Настраиваем дополнительные параметры
            webApp.enableClosingConfirmation(); // Подтверждение закрытия
            webApp.enableVerticalSwipes(); // Вертикальные свайпы
            webApp.setOrientationLock('portrait'); // Фиксация ориентации
          } else {
            // Для других платформ (например, weba) используем expand
            webApp.expand();
          }
          setIsFullscreen(webApp.isFullscreen); // Проверяем реальное состояние

          // Получаем данные пользователя
          const initDataUnsafe = webApp.initDataUnsafe;
          console.log('Init Data Unsafe (WebApp):', initDataUnsafe);
          const user = initDataUnsafe?.user;
          console.log('User (WebApp):', user);

          if (user) {
            setUsername(user.first_name || 'Гость');
            setPhotoUrl(user.photo_url || '');
            setIsPremium(user.is_premium || false);
          } else {
            console.warn('Данные пользователя не найдены в initDataUnsafe, используем "Гость"');
            setUsername('Гость');
          }

          setPlatform(webApp.platform || 'Неизвестно');

          const launchParams: LaunchParams = retrieveLaunchParams();
          console.log('Launch Params (SDK):', launchParams);

          setDebugMessage('Telegram SDK запущен, подключение удачное');

          // Подписываемся на события для отладки
          webApp.onEvent('fullscreenChanged', () => {
            console.log('Событие fullscreenChanged:', webApp.isFullscreen);
            setIsFullscreen(webApp.isFullscreen);
          });
          webApp.onEvent('fullscreenFailed', () => {
            console.warn('Не удалось включить полноэкранный режим');
            setDebugMessage('Не удалось включить полноэкранный режим');
          });
        } catch (e) {
          console.error('Ошибка инициализации Telegram SDK:', e);
          setDebugMessage('Telegram SDK не запущен');
          setUsername('Гость');
          setPhotoUrl('');
          setIsPremium(false);
          setPlatform('Неизвестно');
        }
      } else {
        setDebugMessage('Telegram SDK не запущен (не в среде Telegram)');
        setUsername('Гость');
        setPhotoUrl('');
        setIsPremium(false);
        setPlatform('Неизвестно');
        console.log('Telegram Web App недоступен');
      }
    };

    initializeTelegram();

    const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
    if (script && !window.Telegram?.WebApp) {
      console.log('Ждём загрузки telegram-web-app.js');
      script.addEventListener('load', initializeTelegram);
      return () => script.removeEventListener('load', initializeTelegram);
    }
  }, []);

  return {
    isFullscreen,
    username,
    photoUrl,
    isPremium,
    platform,
    debugMessage,
  };
}