import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { initializeAppData, updateOnlineCoins } from './components/data';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import ProfilePage from './components/ProfilePage';
import StatsPage from './components/StatsPage';
import './App.css';

// Экспортируем интерфейс Game
export interface Game {
  id: string;
  name: string;
  type: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

// Экспортируем интерфейс Referral
export interface Referral {
  telegramId: string;
  username: string;
}

function App() {
  // Состояние активной вкладки
  const [activeTab, setActiveTab] = useState('home');
  
  // Состояние данных приложения
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: 'guest',
    username: 'Гость',
    coins: 0,
    stars: 0,
    referrals: [] as Referral[],
    photoUrl: '',
    firstLogin: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    platforms: [] as string[],
    onlineStatus: 'offline',
  });
  const [inventoryData, setInventoryData] = useState({
    userId: 'guest',
    coins: 0,
    telegramStars: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Получение данных из Telegram через хук
  const { isFullscreen, username, photoUrl, isPremium, platform, userId } = useTelegram();

  // Синхронизация данных пользователя из Telegram
  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      id: userId,
      username,
      photoUrl,
    }));
  }, [userId, username, photoUrl]);

  // Инициализация данных с сервера
  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      const appData = await initializeAppData(
        { userId, username, photoUrl, platform, isPremium },
        userData
      );
      setUserData(appData.userData);
      setInventoryData(appData.inventoryData);
      setGames(appData.games);
      setError(appData.error || null);
      setIsLoading(false);
    };
    if (userId !== 'guest') loadData();
  }, [userId, username, photoUrl, isPremium, platform]);

  // Начисление монет за онлайн каждые 20 секунд
  useEffect(() => {
    if (userId === 'guest' || error) return; // Не начисляем, если нет пользователя или ошибка

    const interval = setInterval(async () => {
      const updatedInventory = await updateOnlineCoins(userId, inventoryData.coins);
      setInventoryData(updatedInventory);
      setUserData((prev) => ({
        ...prev,
        coins: updatedInventory.coins,
        onlineStatus: 'online', // Обновляем статус
      }));
    }, 20000); // 20 секунд

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [userId, inventoryData.coins, error]);

  // Отображение индикатора загрузки или ошибки
  if (isLoading) {
    return (
      <div className="app-container">
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <p>Ошибка: {error}</p>
        {games.length === 0 && <p>Игры не доступны</p>}
      </div>
    );
  }

  // Основной рендер приложения
  return (
    <div className="app-container">
      {/* Шапка с данными пользователя */}
      <UserHeader
        username={userData.username}
        coins={userData.coins}
        stars={userData.stars}
        photoUrl={userData.photoUrl}
      />
      {/* Вкладки приложения */}
      {activeTab === 'home' && (
        <HomePage isFullscreen={isFullscreen} isPremium={isPremium} platform={platform} />
      )}
      {activeTab === 'games' && <GamesPage games={games} />}
      {activeTab === 'profile' && (
        <ProfilePage username={userData.username} coins={userData.coins} stars={userData.stars} />
      )}
      {activeTab === 'stats' && <StatsPage />}
      {/* Навигационное меню */}
      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;