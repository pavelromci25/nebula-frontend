import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { initializeAppData, updateOnlineCoins } from './components/data';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import HomePage from './components/HomePage';
import AppsPage from './components/AppsPage';
import AppDetailPage from './components/AppDetailPage';
import ProfilePage from './components/ProfilePage';
import StatsPage from './components/StatsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

export interface Game {
  id: string;
  name: string;
  type: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

export interface Referral {
  telegramId: string;
  username: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: 'guest',
    username: 'Гость',
    photoUrl: '',
    referrals: [] as Referral[],
    firstLogin: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    platforms: [] as string[],
    onlineStatus: 'offline',
    loginCount: 0,
  });
  const [inventoryData, setInventoryData] = useState({
    userId: 'guest',
    coins: 0,
    stars: 0,
    telegramStars: 0,
    lastCoinUpdate: new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);

  const { isFullscreen, username, photoUrl, isPremium, platform, userId } = useTelegram();

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      id: userId,
      username,
      photoUrl,
    }));
  }, [userId, username, photoUrl]);

  useEffect(() => {
    setIsLoading(true);
    const loadData = async () => {
      const appData = await initializeAppData({ userId, username, photoUrl, platform, isPremium });
      setUserData(appData.userData);
      setInventoryData(appData.inventoryData);
      setGames(appData.games);
      setError(appData.error || null);
      setIsLoading(false);
    };
    if (userId !== 'guest') loadData();
  }, [userId, username, photoUrl, isPremium, platform]);

  // Начисление монет каждые 10 секунд на фронтенде
  useEffect(() => {
    if (userId === 'guest' || error) return;

    const interval = setInterval(async () => {
      const updatedInventory = await updateOnlineCoins(userId, inventoryData.coins);
      setInventoryData(updatedInventory);
    }, 10000); // 10 секунд

    return () => clearInterval(interval);
  }, [userId, inventoryData.coins, error]);

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

  return (
    <Router>
      <div className="app-container">
        <UserHeader
          username={userData.username}
          coins={inventoryData.coins}
          stars={inventoryData.stars}
          photoUrl={userData.photoUrl}
        />
        <Routes>
          <Route path="/" element={<HomePage isFullscreen={isFullscreen} isPremium={isPremium} platform={platform} />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/app/:id" element={<AppDetailPage />} />
          <Route path="/profile" element={<ProfilePage username={userData.username} coins={inventoryData.coins} stars={inventoryData.stars} />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
        <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Router>
  );
}

export default App;