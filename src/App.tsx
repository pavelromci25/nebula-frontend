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
  const [activeTab, setActiveTab] = useState('home');
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
  const [statsPassword, setStatsPassword] = useState<string>(''); // Пароль для статистики
  const [isStatsUnlocked, setIsStatsUnlocked] = useState(false); // Разрешён ли доступ

  const { isFullscreen, username, photoUrl, isPremium, platform, debugMessage, debugPlatform, apiVersion } = useTelegram();

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      id: 'guest', // Здесь будет userId из Telegram или базы
      username: username,
      photoUrl: photoUrl,
      // coins: Будет из базы
      // stars: Будет из базы
    }));
  }, [username, photoUrl]);

  useEffect(() => {
    // Временная заглушка для игр
    setTimeout(() => {
      setGames([
        { id: '1', name: 'Игра 1', type: 'webview', url: 'https://example.com/game1' },
        { id: '2', name: 'Игра 2', type: 'webview', url: 'https://example.com/game2' },
      ]);
      setIsLoading(false);
    }, 1000);

    // Закомментированное место для подключения к базе данных
    /*
    const fetchData = async () => {
      try {
        // Получение данных пользователя
        const userResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/user/${userData.id}`);
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
      }
      setIsLoading(false);
    };
    fetchData();
    */
  }, []);

  const handleStatsAccess = () => {
    const correctPassword = 'admin123'; // Временный пароль (замени на свой)
    if (statsPassword === correctPassword) {
      setIsStatsUnlocked(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const StatsWrapper = () => {
    if (isStatsUnlocked) {
      return <StatsPage />;
    }
    return (
      <div className="content">
        <h2 className="section-title">Статистика</h2>
        <div className="card">
          <h3 className="card-title">Доступ ограничен</h3>
          <p className="card-text">Введите пароль для просмотра статистики:</p>
          <input
            type="password"
            value={statsPassword}
            onChange={(e) => setStatsPassword(e.target.value)}
            className="input"
          />
          <button onClick={handleStatsAccess} className="game-button">
            Подтвердить
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <UserHeader
        username={userData.username}
        coins={userData.coins}
        stars={userData.stars}
        photoUrl={userData.photoUrl}
      />
      {activeTab === 'home' && (
        <HomePage
          debugMessage={debugMessage}
          isFullscreen={isFullscreen}
          isPremium={isPremium}
          platform={platform}
          debugPlatform={debugPlatform}
          apiVersion={apiVersion}
        />
      )}
      {activeTab === 'games' && <GamesPage games={games} />}
      {activeTab === 'profile' && (
        <ProfilePage username={userData.username} coins={userData.coins} stars={userData.stars} />
      )}
      {activeTab === 'stats' && <StatsWrapper />}
      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;