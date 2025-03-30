import { useState, useEffect } from 'react';
import { init, retrieveLaunchParams } from '@telegram-apps/sdk';

// Тип для данных пользователя
interface TelegramUser {
  firstName?: string;
}

export function useTelegram() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [username, setUsername] = useState<string>('Гость');
  const [debugMessage, setDebugMessage] = useState<string>('');

  useEffect(() => {
    // Проверяем наличие Telegram Web App через window
    if (window.Telegram?.WebApp) {
      try {
        // Инициализируем SDK для отладки
        init();

        // 1. Открываем приложение на весь экран
        window.Telegram.WebApp.expand();
        setIsFullscreen(true);

        // 2. Получаем данные пользователя через SDK
        const { initDataUnsafe } = retrieveLaunchParams();
        let user: TelegramUser | undefined;
        if (typeof initDataUnsafe === 'object' && initDataUnsafe !== null && 'user' in initDataUnsafe) {
          user = (initDataUnsafe as { user?: TelegramUser }).user;
        }
        if (user && user.firstName) {
          setUsername(user.firstName);
        } else {
          setUsername('Гость');
        }

        setDebugMessage('Telegram SDK запущен, подключение удачное');
      } catch (e) {
        console.error('Ошибка инициализации Telegram SDK:', e);
        setDebugMessage('Telegram SDK не запущен');
        setUsername('Гость');
      }
    } else {
      setDebugMessage('Telegram SDK не запущен (не в среде Telegram)');
      setUsername('Гость');
    }
  }, []);

  return {
    isFullscreen, // Полноэкранный режим
    username,     // Имя пользователя
    debugMessage, // Отладочное сообщение
  };
}

// Декларация типов для window.Telegram.WebApp
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        expand: () => void;
        // Можно добавить другие методы, если понадобятся
      };
    };
  }
}