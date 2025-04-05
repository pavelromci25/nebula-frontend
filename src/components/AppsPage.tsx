import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { mockApps, App } from '../data/mockApps';
import { Link } from 'react-router-dom';

const AppsPage: React.FC = () => {
  const [category, setCategory] = useState<string>('Все');
  const [filteredApps, setFilteredApps] = useState<App[]>(mockApps);

  // Фильтрация по категориям
  useEffect(() => {
    if (category === 'Все') {
      setFilteredApps(mockApps);
    } else {
      setFilteredApps(mockApps.filter(app => app.categories.includes(category)));
    }
  }, [category]);

  // Категории
  const categories = ['Все', ...new Set(mockApps.flatMap(app => app.categories))];

  // Популярные приложения (слайдер)
  const popularApps = mockApps.slice(0, 3);

  // Выбор редакции
  const editorsChoice = mockApps.slice(0, 3);

  // Новенькое (по дате добавления)
  const newApps = [...mockApps].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 3);

  // Рейтинг (сортировка по формуле)
  const rankedApps = [...filteredApps].sort((a, b) => {
    const scoreA = (a.rating * 0.2) + (a.catalogRating * 0.2) + (a.telegramStars * 0.1) + (a.opens * 0.0001);
    const scoreB = (b.rating * 0.2) + (b.catalogRating * 0.2) + (b.telegramStars * 0.1) + (b.opens * 0.0001);
    return scoreB - scoreA;
  });

  return (
    <div className="content slide-in">
      {/* Фильтры по категориям */}
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

      {/* Слайдер популярных приложений */}
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
                      <p className="featured-game-category">{app.categories.join(', ')}</p>
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

      {/* Выбор редакции */}
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

      {/* Новенькое */}
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

      {/* Рейтинг */}
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