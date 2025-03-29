import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import UserHeader from './components/UserHeader';
import BottomMenu from './components/BottomMenu';
import { FaGamepad, FaShare, FaUser, FaCheck, FaLock } from 'react-icons/fa';
import './App.css';

// Типы данных
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
  // Состояния
  const [activeTab, setActiveTab] = useState('home');
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    id: 'guest',
    username: 'Гость',
    coins: 0,
    stars: 0,
    referrals: [] as Referral[],
    photoUrl: ''
  });
  
  // Хуки
  const { 
    user, 
    isReady, 
    isFullscreen,
    openLink, 
    showMainButton, 
    hideMainButton 
  } = useTelegram();
  
  // API URL
  const API_URL = 'https://nebula-server-ypun.onrender.com';
  
  // Реферальная ссылка
  const referralLink = `https://t.me/NebulaBot?start=ref_${userData.id}`;
  
  // Получение данных пользователя
  useEffect(() => {
    if (isReady) {
      const userId = user?.id ? String(user.id) : 'guest';
      
      fetch(`${API_URL}/api/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          setUserData({
            id: data.id || 'guest',
            username: data.username || 'Гость',
            coins: data.coins || 0,
            stars: data.stars || 0,
            referrals: data.referrals || [],
            photoUrl: data.photoUrl || ''
          });
          
          // Обновляем данные пользователя на сервере
          if (user && user.id) {
            fetch(`${API_URL}/api/user/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                telegramId: String(user.id),
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                photoUrl: user.photo_url
              })
            }).catch(err => console.error('Error updating user:', err));
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          setUserData({
            id: 'guest',
            username: 'Гость',
            coins: 0,
            stars: 0,
            referrals: [],
            photoUrl: ''
          });
        });
      
      // Получение списка игр
      fetch(`${API_URL}/api/games`)
        .then(res => res.json())
        .then(data => {
          setGames(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching games:', err);
          setGames([]);
          setIsLoading(false);
        });
      
      // Таймер для начисления монет
      const coinInterval = setInterval(() => {
        const userId = user?.id ? String(user.id) : 'guest';
        
        fetch(`${API_URL}/api/coins`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, coins: 1 })
        })
          .then(res => res.json())
          .then(data => {
            setUserData(prev => ({
              ...prev,
              coins: data.coins
            }));
          })
          .catch(err => console.error('Error adding coins:', err));
      }, 10000);
      
      return () => clearInterval(coinInterval);
    }
  }, [isReady, user]);
  
  // Пример использования MainButton
  useEffect(() => {
    if (activeTab === 'games' && games.length > 0) {
      showMainButton('Играть в случайную игру', () => {
        const randomGame = games[Math.floor(Math.random() * games.length)];
        launchGame(randomGame);
      });
      
      return () => hideMainButton();
    }
  }, [activeTab, games, showMainButton, hideMainButton]);
  
  // Запуск игры
  const launchGame = (game: Game) => {
    if (game.type === 'webview') {
      openLink(game.url);
    } else {
      // Для TMA игр
      alert(`Запуск игры: ${game.name}`);
    }
  };
  
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
            {games.slice(0, 2).map(game => (
              <div key={game.id} className="game-card">
                <div className="game-image">
                  <FaGamepad />
                </div>
                <div className="game-info">
                  <h3 className="game-title">{game.name}</h3>
                  <button className="game-button" onClick={() => launchGame(game)}>
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
      
      <section className="section">
        <h2 className="section-title">Ваши награды</h2>
        <div className="card">
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="stat-value">{userData.coins}</div>
              <div className="stat-label">Монет</div>
            </div>
            <div className="profile-stat">
              <div className="stat-value">{userData.stars}</div>
              <div className="stat-label">Звезд</div>
            </div>
          </div>
          <p className="card-text">Оставайтесь онлайн, чтобы получать больше монет!</p>
        </div>
      </section>
    </div>
  );
  
  // Компонент GamesPage
  const GamesPage = () => (
    <div className="content">
      <h2 className="section-title">Все игры</h2>
      {games.length > 0 ? (
        <div className="games-grid">
          {games.map(game => (
            <div key={game.id} className="game-card">
              <div className="game-image">
                <FaGamepad />
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.name}</h3>
                {game.description && <p className="card-text">{game.description}</p>}
                <button className="game-button" onClick={() => launchGame(game)}>
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
    </div>
  );
  
  // Компонент ProfilePage
  const ProfilePage = () => (
    <div className="content">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.photoUrl ? (
            <img src={userData.photoUrl} alt="Аватар" />
          ) : (
            userData.username.charAt(0).toUpperCase()
          )}
        </div>
        <h2>{userData.username}</h2>
      </div>
      
      <div className="profile-stats">
        <div className="profile-stat">
          <div className="stat-value">{userData.coins}</div>
          <div className="stat-label">Монет</div>
        </div>
        <div className="profile-stat">
          <div className="stat-value">{userData.stars}</div>
          <div className="stat-label">Звезд</div>
        </div>
        <div className="profile-stat">
          <div className="stat-value">{userData.referrals.length}</div>
          <div className="stat-label">Рефералов</div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="card-title">Реферальная ссылка</h3>
        <p className="referral-link">{referralLink}</p>
        <button className="button" onClick={() => openLink(referralLink)}>
          <FaShare /> Поделиться
        </button>
      </div>
      
      {userData.referrals.length > 0 && (
        <div className="card">
          <h3 className="card-title">Мои рефералы</h3>
          <ul className="referrals-list">
            {userData.referrals.map(ref => (
              <li key={ref.telegramId} className="referral-item">
                <FaUser className="referral-icon" />
                {ref.username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
  // Компонент TodayPage
  const TodayPage = () => (
    <div className="content">
      <h2 className="section-title">Сегодня</h2>
      <div className="card">
        <h3 className="card-title">Ежедневные задания</h3>
        <ul className="task-list">
          <li className="task-item completed">
            <span className="task-name">
              <FaCheck style={{ marginRight: '8px', color: 'green' }} />
              Войти в приложение
            </span>
            <span className="task-reward coins">+5 монет</span>
          </li>
          <li className="task-item">
            <span className="task-name">
              Сыграть в 3 игры
            </span>
            <span className="task-reward coins">+10 монет</span>
          </li>
          <li className="task-item">
            <span className="task-name">
              Пригласить друга
            </span>
            <span className="task-reward stars">+1 звезда</span>
          </li>
        </ul>
      </div>
      
      <div className="card">
        <h3 className="card-title">Недельный прогресс</h3>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ height: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', backgroundColor: '#2481cc' }}></div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px' }}>2/5 дней подряд</p>
        </div>
        <p className="card-text">Заходите ежедневно для получения дополнительных наград!</p>
      </div>
    </div>
  );
  
  // Компонент AppsPage
  const AppsPage = () => (
    <div className="content">
      <h2 className="section-title">Приложения</h2>
      <div className="card">
        <h3 className="card-title">Скоро</h3>
        <p className="card-text">Раздел приложений в разработке. Скоро здесь появятся новые функции!</p>
      </div>
      
      <div className="games-grid">
        <div className="game-card">
          <div className="game-image" style={{ position: 'relative' }}>
            <span>📝</span>
            <FaLock style={{ position: 'absolute', top: '10px', right: '10px' }} />
          </div>
          <div className="game-info">
            <h3 className="game-title">Заметки</h3>
            <p className="card-text">Скоро</p>
          </div>
        </div>
        
        <div className="game-card">
          <div className="game-image" style={{ position: 'relative' }}>
            <span>⏰</span>
            <FaLock style={{ position: 'absolute', top: '10px', right: '10px' }} />
          </div>
          <div className="game-info">
            <h3 className="game-title">Таймер</h3>
            <p className="card-text">Скоро</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Основной рендер
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
      {activeTab === 'today' && <TodayPage />}
      {activeTab === 'apps' && <AppsPage />}
      
      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;