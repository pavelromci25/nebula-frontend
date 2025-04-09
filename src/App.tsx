import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { initializeAppData, updateOnlineCoins } from './components/data';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import HomePage from './components/HomePage';
import AppsPage from './components/AppsPage';
import AppDetailPage from './components/AppDetailPage';
import ProfilePage from './components/ProfilePage';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

export interface Game {
  id: string;
  name: string;
  type: string;
  url: string;
  imageUrl?: string;
  description?: string;
  clicks?: number;
  isPromotedInCatalog?: boolean;
  dateAdded?: string;
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

  const { isFullscreen, username, photoUrl, isPremium, platform, userId, setBackButton } = useTelegram();

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

  // Управление кнопкой "Назад"
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current location:', location.pathname); // Логируем текущий маршрут
    // Показываем кнопку "Назад" на страницах, кроме главной
    if (location.pathname !== '/nebula-frontend/') {
      console.log('Showing BackButton for path:', location.pathname);
      setBackButton(true, () => {
        console.log('BackButton clicked, navigating back');
        navigate(-1); // Возвращаемся на предыдущую страницу
      });
    } else {
      console.log('Hiding BackButton for path:', location.pathname);
      setBackButton(false);
    }

    // Очищаем обработчик при размонтировании
    return () => {
      console.log('Cleaning up BackButton handler');
      setBackButton(false);
    };
  }, [location.pathname, navigate, setBackButton]);

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
    <Router basename="/nebula-frontend">
      <div className="app-container">
        <UserHeader
          username={userData.username}
          coins={inventoryData.coins}
          stars={inventoryData.stars}
          photoUrl={userData.photoUrl}
        />
        <Routes>
          <Route path="/" element={<HomePage isFullscreen={isFullscreen} isPremium={isPremium} platform={platform} games={games} />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/app/:id" element={<AppDetailPage />} />
          <Route path="/profile" element={<ProfilePage username={userData.username} coins={inventoryData.coins} stars={inventoryData.stars} />} />
          <Route path="*" element={
            <div className="content">
              <div className="empty-state">
                <div className="empty-icon">❓</div>
                <h2 className="empty-title">Страница не найдена</h2>
                <p className="empty-description">Попробуйте вернуться на главную страницу.</p>
                <button className="button" onClick={() => window.location.href = '/nebula-frontend/'}>На главную</button>
              </div>
            </div>
          } />
        </Routes>
        <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Router>
  );
}

export default App;