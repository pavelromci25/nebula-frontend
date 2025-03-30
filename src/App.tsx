import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import ProfilePage from './components/ProfilePage';
import StatsPage from './components/StatsPage';
import './App.css';

interface Game {
  id: string;
  name: string;
  type: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

interface Referral {
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
  });

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

  // Загрузка данных с сервера
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        // Обновление данных пользователя на сервере
        const updateResponse = await fetch('https://nebula-server-ypun.onrender.com/api/user/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            username,
            photoUrl,
            platform,
            isPremium,
            coins: userData.coins,
            stars: userData.stars,
            referrals: userData.referrals,
          }),
        });
        const updatedUser = await updateResponse.json();

        // Получение данных пользователя
        const userResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/user/${userId}`);
        const userDataFromServer = await userResponse.json();
        setUserData({
          id: userDataFromServer.userId,
          username: userDataFromServer.username,
          photoUrl: userDataFromServer.photoUrl || '',
          coins: userDataFromServer.coins || 0,
          stars: userDataFromServer.stars || 0,
          referrals: userDataFromServer.referrals || [],
        });

        // Получение списка игр
        const gamesResponse = await fetch('https://nebula-server-ypun.onrender.com/api/games');
        const gamesData = await gamesResponse.json();
        setGames(gamesData);
      } catch (e) {
        console.error('Ошибка загрузки данных:', e);
        setGames([
          { id: '1', name: 'Игра 1', type: 'webview', url: 'https://example.com/game1' },
          { id: '2', name: 'Игра 2', type: 'webview', url: 'https://example.com/game2' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId !== 'guest') fetchData();
  }, [userId, username, photoUrl, isPremium, platform]);

  // Отображение индикатора загрузки
  if (isLoading) {
    return (
      <div className="app-container">
        <p>Загрузка данных...</p>
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