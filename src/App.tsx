import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import { FaGamepad } from 'react-icons/fa';
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

  const { isFullscreen, username, debugMessage } = useTelegram();

  useEffect(() => {
    setUserData((prev) => ({
      ...prev,
      username: username,
    }));
  }, [username]);

  useEffect(() => {
    setTimeout(() => {
      setGames([
        { id: '1', name: 'Игра 1', type: 'webview', url: 'https://example.com/game1' },
        { id: '2', name: 'Игра 2', type: 'webview', url: 'https://example.com/game2' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const HomePage = () => (
    <div className="content">
      <section className="section">
        <h2 className="section-title">Добро пожаловать в Nebula!</h2>
        <div className="card">
          <h3 className="card-title">Ваш игровой портал в Telegram</h3>
          <p className="card-text">{debugMessage || 'Инициализация Telegram SDK...'}</p>
          <p className="card-text">Полноэкранный режим: {isFullscreen ? 'Включён' : 'Выключен'}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Популярные игры</h2>
        {games.length > 0 ? (
          <div className="games-grid">
            {games.slice(0, 2).map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-image">
                  <FaGamepad />
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.name}</h3>
                  <button className="game-button" onClick={() => window.open(game.url, '_blank')}>
                    Играть
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <p className="card-text">Игры не найдены.</p>
          </div>
        )}
      </section>
    </div>
  );

  const GamesPage = () => (
    <div className="content">
      <h2 className="section-title">Все игры</h2>
      {games.length > 0 ? (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-image">
                <FaGamepad />
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.name}</h3>
                <button className="game-button" onClick={() => window.open(game.url, '_blank')}>
                  Играть
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p className="card-text">Игры не найдены.</p>
        </div>
      )}
    </div>
  );

  const ProfilePage = () => (
    <div className="content">
      <h2 className="section-title">Профиль</h2>
      <div className="card">
        <h3 className="card-title">{userData.username}</h3>
        <p className="card-text">Монеты: {userData.coins}</p>
        <p className="card-text">Звёзды: {userData.stars}</p>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <UserHeader
        username={userData.username}
        coins={userData.coins}
        stars={userData.stars}
        photoUrl={userData.photoUrl}
      />
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'games' && <GamesPage />}
      {activeTab === 'profile' && <ProfilePage />}
      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;