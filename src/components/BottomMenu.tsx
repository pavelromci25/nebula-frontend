import React from 'react';
import { FaHome, FaGamepad, FaUser, FaCalendarDay, FaApple } from 'react-icons/fa';

interface BottomMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bottom-menu">
      <button
        className={`menu-item ${activeTab === 'today' ? 'active' : ''}`}
        onClick={() => setActiveTab('today')}
      >
        <FaCalendarDay className="menu-icon" />
        <span>Сегодня</span>
      </button>
      
      <button
        className={`menu-item ${activeTab === 'games' ? 'active' : ''}`}
        onClick={() => setActiveTab('games')}
      >
        <FaGamepad className="menu-icon" />
        <span>Игры</span>
      </button>
      
      <button
        className={`menu-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <FaHome className="menu-icon" />
        <span>Главная</span>
      </button>
      
      <button
        className={`menu-item ${activeTab === 'apps' ? 'active' : ''}`}
        onClick={() => setActiveTab('apps')}
      >
        <FaApple className="menu-icon" />
        <span>Приложения</span>
      </button>
      
      <button
        className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <FaUser className="menu-icon" />
        <span>Профиль</span>
      </button>
    </nav>
  );
};

export default BottomMenu;