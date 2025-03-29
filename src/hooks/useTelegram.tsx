import { useState, useEffect, useCallback } from 'react';
import { 
  app,
  user, 
  mainButton, 
  backButton, 
  viewport, 
  closingConfirmation,
  webApp
} from '@telegram-apps/sdk';

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Инициализация SDK
  useEffect(() => {
    // Инициализируем приложение
    app.ready();
    
    // Получаем данные пользователя
    const telegramUser = user.get();
    if (telegramUser) {
      setUserData(telegramUser);
    } else {
      // Для тестирования в браузере
      setUserData({ id: 'guest', first_name: 'Гость' });
    }
    
    // Расширяем приложение на весь экран
    try {
      viewport.expand();
      setIsFullscreen(true);
    } catch (e) {
      console.error('Ошибка при расширении viewport:', e);
    }
    
    // Включаем подтверждение закрытия
    try {
      closingConfirmation.enable();
    } catch (e) {
      console.error('Ошибка при включении подтверждения закрытия:', e);
    }
    
    setIsReady(true);
    
    return () => {
      // Отключаем действия при размонтировании
      mainButton.hide();
      backButton.hide();
    };
  }, []);
  
  // Открытие внешних ссылок
  const openLink = useCallback((url: string) => {
    try {
      webApp.openLink(url);
    } catch (e) {
      console.error('Ошибка при открытии ссылки:', e);
      window.open(url, '_blank');
    }
  }, []);
  
  // Показать главную кнопку
  const showMainButton = useCallback((text: string, onClick: () => void) => {
    try {
      mainButton.setText(text);
      mainButton.onClick(onClick);
      mainButton.show();
    } catch (e) {
      console.error('Ошибка при показе главной кнопки:', e);
    }
  }, []);
  
  // Скрыть главную кнопку
  const hideMainButton = useCallback(() => {
    try {
      mainButton.hide();
    } catch (e) {
      console.error('Ошибка при скрытии главной кнопки:', e);
    }
  }, []);
  
  // Показать кнопку "Назад"
  const showBackButton = useCallback((onClick: () => void) => {
    try {
      backButton.onClick(onClick);
      backButton.show();
    } catch (e) {
      console.error('Ошибка при показе кнопки назад:', e);
    }
  }, []);
  
  // Скрыть кнопку "Назад"
  const hideBackButton = useCallback(() => {
    try {
      backButton.hide();
    } catch (e) {
      console.error('Ошибка при скрытии кнопки назад:', e);
    }
  }, []);
  
  return {
    user: userData,
    isReady,
    isFullscreen,
    openLink,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton
  };
}