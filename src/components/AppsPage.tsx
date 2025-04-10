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
}

const AppsPage: React.FC = () => {
  const [category, setCategory] = useState<string>('Все');
  const [geoFilter, setGeoFilter] = useState<string>('Все');
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('https://nebula-server-ypun.onrender.com/api/apps');
        const data = await response.json();
        // Фильтруем только приложения
        const appsData = data.filter((app: App) => app.type === 'app');
        setApps(appsData);
        setFilteredApps(appsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке приложений:', error);
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  useEffect(() => {
    let filtered = apps;

    if (category !== 'Все') {
      filtered = filtered.filter(app => app.categories && app.categories.includes(category));
    }

    if (geoFilter !== 'Все') {
      filtered = filtered.filter(app => app.geo === geoFilter);
    }

    setFilteredApps(filtered);
  }, [category, geoFilter, apps]);

  if (isLoading) {
    return <div className="content">Загрузка...</div>;
  }

  const categories = ['Все', ...new Set(apps.flatMap(app => app.categories || []))];
  const geoOptions = ['Все', 'Россия', 'США', 'Германия'];

  // Обновлённая формула рейтинга с учётом Telegram Stars
  const rankedApps = [...filteredApps].sort((a, b) => {
    const scoreA = (a.rating || 0) * 0.2 + (a.catalogRating || 0) * 0.2 + (a.telegramStars || 0) * 0.3 + (a.opens || 0) * 0.0001;
    const scoreB = (b.rating || 0) * 0.2 + (b.catalogRating || 0) * 0.2 + (b.telegramStars || 0) * 0.3 + (b.opens || 0) * 0.0001;
    return scoreB - scoreA;
  });

  return (
    <div className="content slide-in">
      <section className="section">
        <div className="category-tabs">
          {geoOptions.map(geo => (
            <button
              key={geo}
              className={`category-tab ${geoFilter === geo ? 'active' : ''}`}
              onClick={() => setGeoFilter(geo)}
            >
              {geo}
            </button>
          ))}
        </div>
      </section>

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
        <h2 className="section-title">Рейтинг приложений</h2>
        <div className="games-grid">
          {rankedApps.map(app => (
            <Link to={`/app/${app.id}`} key={app.id} className="game-card">
              <div className="flex items-center gap-3">
                <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-lg" />
                <div>
                  <h3 className="game-title">{app.name}</h3>
                  <p className="card-text">{app.shortDescription}</p>
                </div>
              </div>
              <button className="game-button">Get</button>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AppsPage;