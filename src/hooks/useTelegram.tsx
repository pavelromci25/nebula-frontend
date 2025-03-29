import { useState, useEffect } from 'react';
import { init } from '@telegram-apps/sdk';

// Интерфейс для данных пользователя
interface TelegramUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [userData, setUserData] = useState<TelegramUser | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    try {
      // Инициализация SDK
      const { ready, expand, initDataUnsafe } = init();

      // Сообщаем Telegram, что приложение готово
      ready();

      // Получаем данные пользователя
      const telegramUser = initDataUnsafe.user;
      if (telegramUser) {
        setUserData({
          id: String(telegramUser.id),
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          photoUrl: telegramUser.photo_url,
        });
      } else {
        // Заглушка для тестирования вне Telegram
        setUserData({
          id: 'guest',
          firstName: 'Гость',
        });
      }

      // Устанавливаем полноэкранный режим
      expand();
      setIsFullscreen(true);

      setIsReady(true);
    } catch (e) {
      console.error('Ошибка инициализации Telegram SDK:', e);
      // Заглушка при ошибке
      setUserData({ id: 'guest', firstName: 'Гость' });
      setIsReady(true);
    }
  }, []);

  return {
    user: userData,
    isReady,
    isFullscreen,
  };
}