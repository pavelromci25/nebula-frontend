import React from 'react';
import '../App.css';

interface HomePageProps {
  isFullscreen: boolean;
  isPremium: boolean;
  platform: string;
}

const HomePage: React.FC<HomePageProps> = ({ isFullscreen, isPremium, platform }) => (
  <div className="content">
    <section className="section">
      <h2 className="section-title">Добро пожаловать в Nebula!</h2>
      <div className="card">
        <h3 className="card-title">Ваш игровой портал в Telegram</h3>
        <p className="card-text">Полноэкранный режим: {isFullscreen ? 'Включён' : 'Выключен'}</p>
        {isPremium && <p className="card-text">Поздравляем, Вы Премиум</p>}
        <p className="card-text">Вы используете {platform}</p>
      </div>
    </section>
  </div>
);

export default HomePage;