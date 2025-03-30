import React from 'react';
import { FaGamepad } from 'react-icons/fa';
import '../App.css';

interface HomePageProps {
  debugMessage: string;
  isFullscreen: boolean;
  isPremium: boolean;
  platform: string;
  debugPlatform: string;
  apiVersion: string;
}

const HomePage: React.FC<HomePageProps> = ({
  debugMessage,
  isFullscreen,
  isPremium,
  platform,
  debugPlatform,
  apiVersion,
}) => (
  <div className="content">
    <section className="section">
      <h2 className="section-title">Добро пожаловать в Nebula!</h2>
      <div className="card">
        <h3 className="card-title">Ваш игровой портал в Telegram</h3>
        <p className="card-text">{debugMessage || 'Инициализация Telegram SDK...'}</p>
        <p className="card-text">Полноэкранный режим: {isFullscreen ? 'Включён' : 'Выключен'}</p>
        {isPremium && <p className="card-text">Поздравляем, Вы Премиум</p>}
        <p className="card-text">Вы используете {platform}</p>
        <p className="card-text">Отладка платформы: {debugPlatform}</p>
        <p className="card-text">Версия API: {apiVersion}</p>
      </div>
    </section>
  </div>
);

export default HomePage;