import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaStar } from 'react-icons/fa';
import { useTelegram } from '../hooks/useTelegram';

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
  telegramStarsDonations?: number; // Используем telegramStarsDonations
  opens?: number;
  platforms?: string[];
  ageRating?: string;
  inAppPurchases?: boolean;
  dateAdded: string;
  gallery?: string[];
  video?: string;
  complaints?: number;
}

const AppDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<App | null>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const { userId } = useTelegram();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('https://nebula-server-ypun.onrender.com/api/apps');
        const data = await response.json();
        setApps(data);
        const foundApp = data.find((a: App) => a.id === id);
        setApp(foundApp || null);
        setIsLoading(false);

        // Проверка, запускал ли пользователь приложение (заглушка)
        setHasLaunched(true);
      } catch (error) {
        console.error('Ошибка при загрузке приложения:', error);
        setIsLoading(false);
      }
    };
    if (!app) {
      fetchApps();
    }
  }, [id]);

  const handleRating = async (rating: number) => {
    if (!hasLaunched) {
      alert('Вы должны запустить приложение, чтобы оставить рейтинг.');
      return;
    }
    try {
      const response = await fetch(`https://nebula-server-ypun.onrender.com/api/apps/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при отправке рейтинга');
      }
      const updatedApp = await response.json();
      setUserRating(rating);
      setApp(updatedApp);
      alert('Спасибо за ваш рейтинг!');
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error);
    }
  };

  const handleComplaint = async () => {
    if (!hasLaunched) {
      alert('Вы должны запустить приложение, чтобы оставить жалобу.');
      return;
    }
    try {
      const response = await fetch(`https://nebula-server-ypun.onrender.com/api/apps/${id}/complain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Ошибка при отправке жалобы');
      }
      const updatedApp = await response.json();
      setApp(updatedApp);
      alert('Жалоба отправлена. Спасибо за ваш отзыв!');
    } catch (error) {
      console.error('Ошибка при отправке жалобы:', error);
    }
  };

  const handleDonate = async () => {
    try {
      const stars = prompt('Сколько Stars вы хотите подарить? (Максимум 10)', '1');
      const starsNum = parseInt(stars || '0', 10);
      if (isNaN(starsNum) || starsNum <= 0 || starsNum > 10) {
        alert('Пожалуйста, введите число от 1 до 10.');
        return;
      }

      const response = await fetch(`https://nebula-server-ypun.onrender.com/api/apps/${id}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, stars: starsNum }),
      });
      if (!response.ok) {
        throw new Error('Ошибка при отправке доната');
      }
      const result = await response.json();
      alert(result.message);
      // Обновляем telegramStarsDonations локально
      if (app) {
        setApp({ ...app, telegramStarsDonations: result.updatedStars });
      }
    } catch (error) {
      console.error('Ошибка при отправке доната:', error);
      alert('Ошибка при отправке доната. Попробуйте позже.');
    }
  };

  if (isLoading) {
    return <div className="content">Загрузка...</div>;
  }

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

  const similarApps = apps
    .filter(a => a.id !== app.id && a.categories?.length && app.categories?.length && a.categories.some(cat => app.categories!.includes(cat)))
    .slice(0, 3);

  return (
    <div className="content slide-in">
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
          <button className="button" onClick={handleDonate}>Подарить Stars</button>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Рейтинг каталога</p>
              <p className="text-[var(--tg-theme-link-color)]">{app.catalogRating || 'Н/Д'}/5</p>
            </div>
            <div>
              <p className="font-medium">Позиция</p>
              <p className="text-[var(--tg-theme-link-color)]">#{apps.sort((a, b) => (b.catalogRating || 0) - (a.catalogRating || 0)).findIndex(a => a.id === app.id) + 1}</p>
            </div>
            <div>
              <p className="font-medium">Stars</p>
              <p className="text-[var(--tg-theme-link-color)]">{app.telegramStarsDonations || 0}</p> {/* Используем telegramStarsDonations */}
            </div>
            <div>
              <p className="font-medium">Открытия</p>
              <p className="text-[var(--tg-theme-link-color)]">{app.opens || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Галерея</h2>
        {app.gallery && app.gallery.length > 0 ? (
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
        ) : (
          <p className="card-text">Галерея недоступна</p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Описание</h2>
        <div className="card">
          <p className="card-text">{app.longDescription || 'Описание отсутствует'}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Рейтинг</h2>
        <div className="card">
          <p className="font-medium mb-2">Средний рейтинг: {app.rating || 0}/5</p>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <FaStar
                key={star}
                className={`cursor-pointer ${userRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
          <button className="button" onClick={handleComplaint}>Приложение не работает</button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">О приложении</h2>
        <div className="card">
          <p className="card-text"><strong>Разработчик:</strong> {app.developer || 'Не указан'}</p>
          <p className="card-text">
            <strong>Категории:</strong>{' '}
            {app.categories && app.categories.length > 0 ? (
              app.categories.map((cat, index) => (
                <span key={cat}>
                  <Link to={`/apps?category=${cat}`} className="text-[var(--tg-theme-link-color)]">{cat}</Link>
                  {index < (app.categories?.length ?? 0) - 1 ? ', ' : ''}
                </span>
              ))
            ) : (
              'Без категории'
            )}
          </p>
          <p className="card-text"><strong>Игровые покупки:</strong> {app.inAppPurchases !== undefined ? (app.inAppPurchases ? 'Да' : 'Нет') : 'Не указано'}</p>
          <p className="card-text"><strong>Возрастной рейтинг:</strong> {app.ageRating || 'Не указано'}</p>
          <p className="card-text"><strong>Платформы:</strong> {app.platforms && app.platforms.length > 0 ? app.platforms.join(', ') : 'Не указано'}</p>
          <p className="card-text"><strong>Дата добавления:</strong> {app.dateAdded}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Реклама</h2>
        <div className="card">
          <div style={{ background: '#ddd', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Рекламный баннер (заглушка)</p>
          </div>
        </div>
      </section>

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