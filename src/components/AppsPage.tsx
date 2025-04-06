import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

interface App {
  id: string;
  type: 'game' | 'app';
  name: string;
  icon: string;
  banner?: string;
  shortDescription: string;
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
}

const AppsPage: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState<'all' | 'games' | 'apps'>('all');
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
        setApps(data);
        setFilteredApps(data);
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

    if (globalFilter === 'games') {
      filtered = filtered.filter(app => app.type === 'game');
    } else if (globalFilter === 'apps') {
      filtered = filtered.filter(app => app.type === 'app');
    }

    if (category !== 'Все') {
      filtered = filtered.filter(app => app.categories && app.categories.includes(category));
    }

    if (geoFilter !== 'Все') {
      filtered = filtered.filter(app => app.geo === geoFilter);
    }

    setFilteredApps(filtered);
  }, [globalFilter, category, geoFilter, apps]);

  if (isLoading) {
    return <div className="content">Загрузка...</div>;
  }

  const categories = ['Все', ...new Set(apps.flatMap(app => app.categories || []))];
  const geoOptions = ['Все', 'Россия', 'США', 'Германия'];

  const popularApps = apps.slice(0, 3);
  const editorsChoice = apps.slice(0, 3);
  const newApps = [...apps].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 3);

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
          <button
            className={`category-tab ${globalFilter === 'all' ? 'active' : ''}`}
            onClick={() => setGlobalFilter('all')}
          >
            Все
          </button>
          <button
            className={`category-tab ${globalFilter === 'games' ? 'active' : ''}`}
            onClick={() => setGlobalFilter('games')}
          >
            Игры
          </button>
          <button
            className={`category-tab ${globalFilter === 'apps' ? 'active' : ''}`}
            onClick={() => setGlobalFilter('apps')}
          >
            Приложения
          </button>
        </div>
      </section>

      {globalFilter === 'apps' && (
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
      )}

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
        <h2 className="section-title">Популярное</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="featured-carousel"
        >
          {popularApps.map(app => (
            <SwiperSlide key={app.id}>
              <Link to={`/app/${app.id}`} className="featured-game">
                <div className="featured-game-image">
                  <img src={app.banner} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="featured-game-info">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-lg" />
                    <div>
                      <h3 className="featured-game-title">{app.name}</h3>
                      <p className="featured-game-category">{app.categories ? app.categories.join(', ') : 'Без категории'}</p>
                    </div>
                  </div>
                  <p className="card-text">{app.shortDescription}</p>
                  <button className="button">Get</button>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="section">
        <h2 className="section-title">Выбор редакции</h2>
        <div className="games-grid">
          {editorsChoice.map(app => (
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

      <section className="section">
        <h2 className="section-title">Новенькое</h2>
        <div className="games-grid">
          {newApps.map(app => (
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

      <section className="section">
        <h2 className="section-title">Рейтинг</h2>
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