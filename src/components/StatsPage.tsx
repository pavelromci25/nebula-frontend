import React from 'react';
import '../App.css';

const StatsPage: React.FC = () => (
  <div className="content">
    <h2 className="section-title">Статистика</h2>
    <div className="card">
      <h3 className="card-title">Техническая информация</h3>
      <p className="card-text">Количество пользователей: {/* Будет из базы */} 0</p>
      <p className="card-text">Премиум пользователей: {/* Будет из базы */} 0</p>
      <p className="card-text">Платформы:</p>
      <ul>
        <li>Android: {/* Будет из базы */} 0</li>
        <li>iOS: {/* Будет из базы */} 0</li>
        <li>Web: {/* Будет из базы */} 0</li>
      </ul>
      <p className="card-text">Баланс монет пользователей: {/* Будет из базы */} Не доступно</p>
      <p className="card-text">Баланс звёзд пользователей: {/* Будет из базы */} Не доступно</p>
    </div>
  </div>
);

export default StatsPage;