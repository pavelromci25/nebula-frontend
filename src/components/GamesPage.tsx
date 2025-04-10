import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface App {
  id: string;
  type: 'game' | 'app';
  name: string;
  icon: string;
  banner?: string;
  shortDescription: string;
  longDescription?: string;
  categories?: string[];
  geo?: string;
  developer?: string;
  rating?: number;
  catalogRating?: number;
  telegramStars?: number;
  opens?: number;
  platforms?: string[];
  ageRating?: string;
  inAppPurchases?: boolean;
  dateAdded: string;
  gallery?: string[];
  video?: string;
  complaints?: number;
  linkApp?: string;
  startPromoCatalog?: string;
  finishPromoCatalog?: string;
  startPromoCategory?: string;
  finishPromoCategory?: string;
  isPromotedInCatalog?: boolean;
  isPromotedInCategory?: boolean;
}

const GamesPage: React.FC = () => {
  const [category, setCategory] = useState<string>('Все');
  const [games, setGames] = useState<App[]>([]);
  const [filteredGames, setFilteredGames] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://nebula-server-ypun.onrender.com/api/apps');
        const data = await response.json();
        const gamesData = data.filter((app: App) => app.type === 'game');
        setGames(gamesData);
        setFilteredGames(gamesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке игр:', error);
        setIsLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    if (category !== 'Все') {
      filtered = filtered.filter(app => app.categories && app.categories.includes(category));
    }

    setFilteredGames(filtered);
  }, [category, games]);

  if (isLoading) {
    return <div className="content">Загрузка...</div>;
  }

  const categories = ['Все', ...new Set(games.flatMap(app => app.categories || []))];

  const rankedGames = [...filteredGames].sort((a, b) => {
    if (a.isPromotedInCatalog && !b.isPromotedInCatalog) return -1;
    if (!a.isPromotedInCatalog && b.isPromotedInCatalog) return 1;

    if (category !== 'Все') {
      if (a.isPromotedInCategory && !b.isPromotedInCategory) return -1;
      if (!a.isPromotedInCategory && b.isPromotedInCategory) return 1;
    }

    const scoreA = (a.rating || 0) * 0.2 + (a.catalogRating || 0) * 0.2 + (a.telegramStars || 0) * 0.3 + (a.opens || 0) * 0.0001;
    const scoreB = (b.rating || 0) * 0.2 + (b.catalogRating || 0) * 0.2 + (b.telegramStars || 0) * 0.3 + (b.opens || 0) * 0.0001;
    return scoreB - scoreA;
  });

  
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
        setGames(games.map(app => app.id === appId ? { ...app, opens: result.clicks } : app));
        setFilteredGames(filteredGames.map(app => app.id === appId ? { ...app, opens: result.clicks } : app));
  
        // Используем Telegram.WebApp.openTelegramLink для переадресации
        if (window.Telegram && window.Telegram.WebApp) {
          window.Telegram.WebApp.openTelegramLink(linkApp);
        } else {
          // Fallback для десктопа или случаев, когда Telegram.WebApp недоступен
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
    <div className="content slide-in">
      <section className="section">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-tab ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Рейтинг игр</h2>
        <div className="games-grid">
          {rankedGames.map(game => (
            <Link
              to={`/app/${game.id}`}
              key={game.id}
              className={`game-card ${game.isPromotedInCatalog ? 'promoted-catalog' : ''} ${game.isPromotedInCategory ? 'promoted-category' : ''}`}
              style={{
                ...(game.isPromotedInCatalog ? { border: '2px solid yellow' } : {}),
                ...(game.isPromotedInCategory && !game.isPromotedInCatalog ? { border: '2px solid orange' } : {}),
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={game.icon}
                  alt={game.name}
                  style={{
                    width: '125px',
                    height: '125px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <h3 className="game-title">{game.name}</h3>
                  <p className="card-text">{game.shortDescription}</p>
                </div>
              </div>
              <button className="game-button" onClick={(e) => { e.preventDefault(); handleGetClick(game.id, game.linkApp); }}>Get</button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GamesPage;