import React from 'react';
import { FaStar, FaCoins } from 'react-icons/fa';

interface UserHeaderProps {
  username: string;
  coins: number;
  stars: number;
  photoUrl?: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ username, coins, stars, photoUrl }) => {
  return (
    <header className="user-header">
      <div className="user-profile">
        <div className="avatar">
          {photoUrl ? (
            <img src={photoUrl} alt="Аватар" />
          ) : (
            username.charAt(0).toUpperCase()
          )}
        </div>
        <span>{username}</span>
      </div>
      
      <div className="user-stats">
        <div className="stat-item">
          <FaStar color="#FFD700" />
          <span>{stars}</span>
        </div>
        <div className="stat-item">
          <FaCoins color="#FFD700" />
          <span>{coins}</span>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;