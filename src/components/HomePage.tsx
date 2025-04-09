import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface Game {
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

interface HomePageProps {
  isFullscreen: boolean;
  isPremium: boolean;
  platform: string;
  games: Game[];
}

const HomePage: React.FC<HomePageProps> = ({ games }) => {
  // Сортировка для блока "Популярное" (по кликам)
  const popularGames = [...games]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 5);

  // Сортировка для блока "Выбор редакции" (продвигаемые приложения)
  const editorsChoice = games
    .filter(game => game.isPromotedInCatalog)
    .slice(0, 5);

  // Сортировка для блока "Новенькое" (по дате добавления)
  const newGames = [...games]
    .sort((a, b) => new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime())
    .slice(0, 5);

  return (
    <div className="content">
      {/* Блок "Популярное" */}
      <section className="section">
        <h2 className="section-title">Популярное</h2>
        {popularGames.length === 0 ? (
          <p>Нет популярных игр.</p>
        ) : (
          <div className="games-grid">
            {popularGames.map(game => (
              <Link to={`/app/${game.id}`} key={game.id} className="game-card">
                <div className="flex items-center gap-3">
                  <img src={game.imageUrl} alt={game.name} className="w-10 h-10 rounded-lg" />
                  <div>
                    <h3 className="game-title">{game.name}</h3>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
                <button className="game-button">Get</button>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Блок "Выбор редакции" */}
      <section className="section">
        <h2 className="section-title">Выбор редакции</h2>
        {editorsChoice.length === 0 ? (
          <p>Нет продвигаемых игр.</p>
        ) : (
          <div className="games-grid">
            {editorsChoice.map(game => (
              <Link to={`/app/${game.id}`} key={game.id} className="game-card">
                <div className="flex items-center gap-3">
                  <img src={game.imageUrl} alt={game.name} className="w-10 h-10 rounded-lg" />
                  <div>
                    <h3 className="game-title">{game.name}</h3>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
                <button className="game-button">Get</button>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Блок "Новенькое" */}
      <section className="section">
        <h2 className="section-title">Новенькое</h2>
        {newGames.length === 0 ? (
          <p>Нет новых игр.</p>
        ) : (
          <div className="games-grid">
            {newGames.map(game => (
              <Link to={`/app/${game.id}`} key={game.id} className="game-card">
                <div className="flex items-center gap-3">
                  <img src={game.imageUrl} alt={game.name} className="w-10 h-10 rounded-lg" />
                  <div>
                    <h3 className="game-title">{game.name}</h3>
                    <p className="card-text">{game.description}</p>
                  </div>
                </div>
                <button className="game-button">Get</button>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;