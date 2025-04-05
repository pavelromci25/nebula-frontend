import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { mockApps, App } from '../data/mockApps';

const AppDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const app = mockApps.find(app => app.id === id);

  if (!app) {
    return (
      <div className="content">
        <div className="empty-state">
          <div className="empty-icon">❓</div>
          <h2 className="empty-title">Приложение не найдено</h2>
          <p className="empty-description">Попробуйте выбрать другое приложение из каталога.</p>
        </div>
      </div>
    );
  }

  // Похожие приложения (из той же категории)
  const similarApps = mockApps
    .filter(a => a.id !== app.id && a.categories.some(cat => app.categories.includes(cat)))
    .slice(0, 3);

  return (
    <div className="content slide-in">
      {/* Основная информация */}
      <section className="section">
        <div className="flex items-center gap-4 mb-4">
          <img src={app.icon} alt={app.name} className="w-20 h-20 rounded-lg" />
          <div>
            <h1 className="section-title">{app.name}</h1>
            <p className="card-text">{app.shortDescription}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="button">Get</button>
          <button className="button">Поделиться</button>
        </div>
      </section>

      {/* Статус Бар */}
      <section className="section">
        <div className="card">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Рейтинг каталога</p>
              <p className="text-[var(--tg-theme-link-color)]">{app.catalogRating}/5</p>
            </div>
            <div>
              <p className="font-medium">Позиция</p>
              <p className="text-[var(--tg-theme-link-color)]">#{mockApps.sort((a, b) => b.catalogRating - a.catalogRating).findIndex(a => a.id === app.id) + 1}</p>
            </div>
            <div>
              <p className="font-medium">Telegram Stars</p>
              <p className="text-[var(--tg-theme-link-color)]">{app.telegramStars}</p>
            </div>
            <div>
              <p className="font-medium">Открытия</p>
              <p className="text-[var(--tg-theme-link-color)]">{app.opens}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Галерея */}
      <section className="section">
        <h2 className="section-title">Галерея</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="featured-carousel"
        >
          {app.gallery.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`${app.name} screenshot ${index + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            </SwiperSlide>
          ))}
          {app.video && (
            <SwiperSlide>
              <iframe
                src={app.video}
                title={`${app.name} video`}
                width="100%"
                height="200px"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </SwiperSlide>
          )}
        </Swiper>
      </section>

      {/* Описание */}
      <section className="section">
        <h2 className="section-title">Описание</h2>
        <div className="card">
          <p className="card-text">{app.longDescription}</p>
        </div>
      </section>

      {/* Рейтинг от пользователей */}
      <section className="section">
        <h2 className="section-title">Рейтинг</h2>
        <div className="card">
          <p className="font-medium">Средний рейтинг: {app.rating}/5</p>
        </div>
      </section>

      {/* Данные о приложении */}
      <section className="section">
        <h2 className="section-title">О приложении</h2>
        <div className="card">
          <p className="card-text"><strong>Разработчик:</strong> {app.developer}</p>
          <p className="card-text"><strong>Категории:</strong> {app.categories.join(', ')}</p>
          <p className="card-text"><strong>Игровые покупки:</strong> {app.inAppPurchases ? 'Да' : 'Нет'}</p>
          <p className="card-text"><strong>Возрастной рейтинг:</strong> {app.ageRating}</p>
          <p className="card-text"><strong>Платформы:</strong> {app.platforms.join(', ')}</p>
          <p className="card-text"><strong>Дата добавления:</strong> {app.dateAdded}</p>
        </div>
      </section>

      {/* Рекламный блок */}
      <section className="section">
        <h2 className="section-title">Реклама</h2>
        <div className="card">
          <div style={{ background: '#ddd', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Рекламный баннер (заглушка)</p>
          </div>
        </div>
      </section>

      {/* Похожие приложения */}
      <section className="section">
        <h2 className="section-title">Похожие приложения</h2>
        <div className="games-grid">
          {similarApps.map(similarApp => (
            <Link to={`/app/${similarApp.id}`} key={similarApp.id} className="game-card">
              <div className="flex items-center gap-3">
                <img src={similarApp.icon} alt={similarApp.name} className="w-10 h-10 rounded-lg" />
                <div>
                  <h3 className="game-title">{similarApp.name}</h3>
                  <p className="card-text">{similarApp.shortDescription}</p>
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

export default AppDetailPage;