import { useState, useEffect } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

// Тип для данных пользователя
interface TelegramUser {
  firstName?: string;
  id?: number;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  languageCode?: string;
  isBot?: boolean;
  isPremium?: boolean;
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
  const [debugMessage, setDebugMessage] = useState<string>('Инициализация Telegram SDK...');

  useEffect(() => {
    // Функция для проверки и инициализации Telegram Web App
    const initializeTelegram = () => {
      console.log('Проверка window.Telegram:', window.Telegram);
      if (window.Telegram && window.Telegram.WebApp) {
        try {
          // 1. Открываем приложение на весь экран
          console.log('Вызываем expand()');
          window.Telegram.WebApp.expand();
          setIsFullscreen(true);

          // 2. Получаем данные пользователя напрямую из Telegram Web App
          const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
          console.log('Init Data Unsafe (WebApp):', initDataUnsafe);
          const user = initDataUnsafe?.user;
          console.log('User (WebApp):', user);

          if (user && user.firstName) {
            setUsername(user.firstName);
            console.log('Установлено имя пользователя:', user.firstName);
          } else {
            console.warn('Данные пользователя не найдены в initDataUnsafe, используем "Гость"');
            setUsername('Гость');
          }

          // Дополнительно: проверяем retrieveLaunchParams для отладки
          const launchParams: LaunchParams = retrieveLaunchParams();
          console.log('Launch Params (SDK):', launchParams);

          setDebugMessage('Telegram SDK запущен, подключение удачное');
        } catch (e) {
          console.error('Ошибка инициализации Telegram SDK:', e);
          setDebugMessage('Telegram SDK не запущен');
          setUsername('Гость');
        }
      } else {
        setDebugMessage('Telegram SDK не запущен (не в среде Telegram)');
        setUsername('Гость');
        console.log('Telegram Web App недоступен');
      }
    };

    // Проверяем сразу
    initializeTelegram();

    // Если скрипт ещё не загрузился, ждём его
    const script = document.querySelector('script[src="https://telegram.org/js/telegram-web-app.js"]');
    if (script && !window.Telegram?.WebApp) {
      console.log('Ждём загрузки telegram-web-app.js');
      script.addEventListener('load', initializeTelegram);
      return () => script.removeEventListener('load', initializeTelegram);
    }
  }, []);

  return {
    isFullscreen, // Полноэкранный режим
    username,     // Имя пользователя
    debugMessage, // Отладочное сообщение
  };
}