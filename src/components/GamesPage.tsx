import React from 'react';
import { FaGamepad } from 'react-icons/fa';
import '../App.css';

interface Game {
  id: string;
  name: string;
  type: string;
  url: string;
  imageUrl?: string;
  description?: string;
}

interface GamesPageProps {
  games: Game[];
}

const GamesPage: React.FC<GamesPageProps> = ({ games }) => (
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

export default GamesPage;