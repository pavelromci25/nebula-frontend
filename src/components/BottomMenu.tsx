import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaGamepad, FaChartBar, FaUser } from 'react-icons/fa';

interface BottomMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="bottom-menu">
      <button
        className={`menu-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleTabClick('home', '/')}
      >
        <FaHome className="menu-icon" />
        Главная
      </button>
      <button
        className={`menu-item ${activeTab === 'apps' ? 'active' : ''}`}
        onClick={() => handleTabClick('apps', '/apps')}
      >
        <FaGamepad className="menu-icon" />
        Apps
      </button>
      <button
        className={`menu-item ${activeTab === 'stats' ? 'active' : ''}`}
        onClick={() => handleTabClick('stats', '/stats')}
      >
        <FaChartBar className="menu-icon" />
        Статистика
      </button>
      <button
        className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => handleTabClick('profile', '/profile')}
      >
        <FaUser className="menu-icon" />
        Профиль
      </button>
    </div>
  );
};

export default BottomMenu;