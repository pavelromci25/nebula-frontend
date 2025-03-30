import React from 'react';
import '../App.css';

interface ProfilePageProps {
  username: string;
  coins: number;
  stars: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ username, coins, stars }) => (
  <div className="content">
    <h2 className="section-title">Профиль</h2>
    <div className="card">
      <h3 className="card-title">{username}</h3>
      <p className="card-text">Монеты: {coins}</p>
      <p className="card-text">Звёзды: {stars}</p>
    </div>
  </div>
);

export default ProfilePage;