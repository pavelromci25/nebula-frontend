import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface HomePageProps {
  isFullscreen: boolean;
  isPremium: boolean;
  platform: string;
  games: Game[];
}

interface Game {
  id: string;
  name: string;
  categoryGame?: string;
  categoryApps?: string;
  url: string;
  imageUrl?: string;
  description?: string;
  clicks?: number;
  isPromotedInCatalog?: boolean;
  dateAdded?: string;
  linkApp?: string;
  startPromoCatalog?: string;
  finishPromoCatalog?: string;
  startPromoCategory?: string;
  finishPromoCategory?: string;
  editCount?: number;
}

const HomePage: React.FC<HomePageProps> = ({ games }) => {
  console.log('HomePage rendering, props:', { games });

  const popularGames = [...games]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5);

  const editorsChoice = games
    .filter(game => game.isPromotedInCatalog)
    .slice(0, 5);

  const newGames = [...games]
    .sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime())
    .slice(0, 5);

    const handleGetClick = async (appId: string, linkApp?: string) => {
      if (linkApp) {
        try {
          const response = await fetch(`https://nebula-server-ypun.onrender.com/api/apps/${appId}/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) {
            throw new Error('Ошибка при увеличении счётчика кликов');
          }
          const result = await response.json();
          console.log('Счётчик кликов увеличен:', result);
    
          if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.openTelegramLink(linkApp);
          } else {
            window.open(linkApp, '_blank');
          }
        } catch (error) {
          console.error('Ошибка при увеличении счётчика кликов:', error);
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          alert('Ошибка при переходе по ссылке: ' + errorMessage);
        }
      } else {
        alert('Ссылка на приложение недоступна.');
      }
    };

  return (
    <div className="content">
      <section className="section">
        <h2 className="section-title">Популярное</h2>
        {popularGames.length === 0 ? (
          <p>Нет популярных игр.</p>
        ) : (
          <div className="games-grid">
            {popularGames.map(game => (
              <Link
              to={`/app/${game.id}`}
              key={game.id}
              className="game-card"
            >
                <div className="flex items-center gap-3">
                  <img src={game.imageUrl} alt={game.name} style={{
          width: '125px',
          height: '125px',
          borderRadius: '10px',
          objectFit: 'cover',
        }} />
                  <div>
                    <h3 className="game-title">{game.name}</h3>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
                <button className="game-button">Get</button> {/* Убираем onClick */}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Выбор редакции</h2>
        {editorsChoice.length === 0 ? (
          <p>Нет продвигаемых игр.</p>
        ) : (
          <div className="games-grid">
            {editorsChoice.map(game => (
              <Link
              to={`/app/${game.id}`}
              key={game.id}
              className="game-card"
            >
                <div className="flex items-center gap-3">
                  <img src={game.imageUrl} alt={game.name} style={{
                    width: '125px',
                    height: '125px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }} />
                  <div>
                    <h3 className="game-title">{game.name}</h3>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
                <button className="game-button">Get</button> {/* Убираем onClick */}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Новенькое</h2>
        {newGames.length === 0 ? (
          <p>Нет новых игр.</p>
        ) : (
          <div className="games-grid">
            {newGames.map(game => (
              <Link
              to={`/app/${game.id}`}
              key={game.id}
              className="game-card"
            >
                <div className="flex items-center gap-3">
                  <img src={game.imageUrl} alt={game.name} style={{
                    width: '125px',
                    height: '125px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }} />
                  <div>
                    <h3 className="game-title">{game.name}</h3>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
                <button className="game-button">Get</button> {/* Убираем onClick */}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;