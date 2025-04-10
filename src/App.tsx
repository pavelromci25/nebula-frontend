import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { initializeAppData, updateOnlineCoins } from './components/data';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import HomePage from './components/HomePage';
import AppsPage from './components/AppsPage';
import AppDetailPage from './components/AppDetailPage';
import ProfilePage from './components/ProfilePage';
import GamesPage from './components/GamesPage'; // Добавляем импорт GamesPage
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

export interface Game {
  id: string;
  name: string;
  categoryGame?: string; // Новая основная категория для игр
  categoryApps?: string; // Новая основная категория для приложений
  url: string;
  imageUrl?: string;
  description?: string;
  clicks?: number;
  isPromotedInCatalog?: boolean;
  dateAdded?: string;
  linkApp?: string; // Добавляем linkApp
  startPromoCatalog?: string; // Добавляем startPromoCatalog
  finishPromoCatalog?: string; // Добавляем finishPromoCatalog
  startPromoCategory?: string; // Добавляем startPromoCategory
  finishPromoCategory?: string; // Добавляем finishPromoCategory
  editCount?: number; // Добавляем editCount
}

export interface Referral {
  telegramId: string;
  username: string;
}

function AppContent({ games, userData, inventoryData, error, isLoading, activeTab, setActiveTab }: {
  games: Game[];
  userData: any;
  inventoryData: any;
  error: string | null;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { isFullscreen, isPremium, platform } = useTelegram();
  const location = useLocation();
  const navigate = useNavigate();

  console.log('AppContent rendering, props:', { games, userData, inventoryData, error, isLoading, activeTab });

  useEffect(() => {
    console.log('Current location:', location.pathname);
    // Уведомляем Telegram о смене страницы
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      console.log('Notified Telegram of page change:', location.pathname);
    }
  }, [location.pathname, navigate]);

  if (isLoading) {
    console.log('AppContent: Showing loading state');
    return (
      <div className="app-container">
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    console.log('AppContent: Showing error state', error);
    return (
      <div className="app-container">
        <p>Ошибка: {error}</p>
        {games.length === 0 && <p>Игры не доступны</p>}
      </div>
    );
  }

  console.log('AppContent: Rendering main content');
  return (
    <div className="app-container">
      <UserHeader
        username={userData.username}
        coins={inventoryData.coins}
        stars={inventoryData.stars}
        photoUrl={userData.photoUrl}
      />
      <Routes>
        <Route path="/" element={<HomePage isFullscreen={isFullscreen} isPremium={isPremium} platform={platform} games={games} />} />
        <Route path="/games" element={<GamesPage />} /> {/* Заменяем AppsPage на GamesPage */}
        <Route path="/apps" element={<AppsPage />} />
        <Route path="/app/:id" element={<AppDetailPage />} />
        <Route path="/profile" element={<ProfilePage username={userData.username} coins={inventoryData.coins} stars={inventoryData.stars} />} />
        <Route path="*" element={
          <div className="content">
            <div className="empty-state">
              <div className="empty-icon">❓</div>
              <h2 className="empty-title">Страница не найдена</h2>
              <p className="empty-description">Попробуйте вернуться на главную страницу.</p>
              <button className="button" onClick={() => window.location.href = '/'}>На главную</button>
            </div>
          </div>
        } />
      </Routes>
      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
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

  const { username, photoUrl, userId } = useTelegram();

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
      const appData = await initializeAppData({ userId, username, photoUrl, platform: 'unknown', isPremium: false });
      setUserData(appData.userData);
      setInventoryData(appData.inventoryData);
      setGames(appData.games);
      setError(appData.error || null);
      setIsLoading(false);
    };
    if (userId !== 'guest') loadData();
  }, [userId, username, photoUrl]);

  // Начисление монет каждые 10 секунд на фронтенде
  useEffect(() => {
    if (userId === 'guest' || error) return;

    const interval = setInterval(async () => {
      const updatedInventory = await updateOnlineCoins(userId, inventoryData.coins);
      setInventoryData(updatedInventory);
    }, 10000); // 10 секунд

    return () => clearInterval(interval);
  }, [userId, inventoryData.coins, error]);

  return (
    <Router basename="/">
      <AppContent
        games={games}
        userData={userData}
        inventoryData={inventoryData}
        error={error}
        isLoading={isLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </Router>
  );
}

export default App;