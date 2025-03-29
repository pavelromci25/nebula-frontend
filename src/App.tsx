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

  const { user, isReady, isFullscreen } = useTelegram();

  const API_URL = 'https://nebula-server-ypun.onrender.com';

  useEffect(() => {
    if (isReady && user) {
      const userId = user.id || 'guest';

      // Получение данных пользователя
      fetch(`${API_URL}/api/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData({
            id: data.id || user.id || 'guest',
            username: data.username || user.username || user.firstName || 'Гость',
            coins: data.coins || 0,
            stars: data.stars || 0,
            referrals: data.referrals || [],
            photoUrl: data.photoUrl || user.photoUrl || '',
          });

          // Обновляем данные пользователя на сервере
          fetch(`${API_URL}/api/user/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              telegramId: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              photoUrl: user.photoUrl,
            }),
          }).catch((err) => console.error('Error updating user:', err));
        })
        .catch((err) => {
          console.error('Error fetching user data:', err);
          setUserData({
            id: user.id || 'guest',
            username: user.username || user.firstName || 'Гость',
            coins: 0,
            stars: 0,
            referrals: [],
            photoUrl: user.photoUrl || '',
          });
        });

      // Получение списка игр
      fetch(`${API_URL}/api/games`)
        .then((res) => res.json())
        .then((data) => {
          setGames(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching games:', err);
          setGames([]);
          setIsLoading(false);
        });
    }
  }, [isReady, user]);

  // Загрузка
  if (!isReady || isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка Nebula...</p>
      </div>
    );
  }

  // Компонент HomePage
  const HomePage = () => (
    <div className="content">
      <section className="section">
        <h2 className="section-title">Добро пожаловать в Nebula!</h2>
        <div className="card">
          <h3 className="card-title">Ваш игровой портал в Telegram</h3>
          <p className="card-text">Играйте в игры, зарабатывайте монеты и получайте звезды!</p>
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
            <p className="card-text">Игры не найдены. Попробуйте позже.</p>
          </div>
        )}
      </section>
    </div>
  );

  // Основной рендер (упрощен до главной страницы)
  return (
    <div className="app-container">
      <UserHeader
        username={userData.username}
        coins={userData.coins}
        stars={userData.stars}
        photoUrl={userData.photoUrl}
      />
      <HomePage />
      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;