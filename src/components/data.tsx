import { Game, Referral } from '../App';

interface UserData {
  id: string;
  username: string;
  coins: number;
  stars: number;
  referrals: Referral[];
  photoUrl: string;
  firstLogin: string;
  lastLogin: string;
  platforms: string[];
  onlineStatus: string;
}

interface InventoryData {
  userId: string;
  coins: number;
  telegramStars: number;
}

interface TelegramData {
  userId: string;
  username: string;
  photoUrl: string;
  platform: string;
  isPremium: boolean;
}

interface AppData {
  userData: UserData;
  inventoryData: InventoryData;
  games: Game[];
  error?: string;
}

export const initializeAppData = async (
  telegramData: TelegramData,
  currentUserData: UserData
): Promise<AppData> => {
  try {
    // Обновление данных пользователя на сервере
    const updateUserResponse = await fetch('https://nebula-server-ypun.onrender.com/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: telegramData.userId,
        username: telegramData.username,
        photoUrl: telegramData.photoUrl,
        platform: telegramData.platform,
        isPremium: telegramData.isPremium,
        coins: currentUserData.coins,
        stars: currentUserData.stars,
        referrals: currentUserData.referrals,
        onlineStatus: 'online', // Устанавливаем онлайн-статус при входе
      }),
    });
    if (!updateUserResponse.ok) throw new Error('Ошибка обновления данных пользователя');
    const userData = await updateUserResponse.json();

    // Обновление инвентаря пользователя
    const updateInventoryResponse = await fetch('https://nebula-server-ypun.onrender.com/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: telegramData.userId,
        coins: currentUserData.coins,
        telegramStars: 0, // Пока статично, позже добавим донаты
      }),
    });
    if (!updateInventoryResponse.ok) throw new Error('Ошибка обновления инвентаря');
    const inventoryData = await updateInventoryResponse.json();

    // Получение списка игр
    const gamesResponse = await fetch('https://nebula-server-ypun.onrender.com/api/games');
    if (!gamesResponse.ok) throw new Error('Игры не доступны');
    const games = await gamesResponse.json();

    return { userData, inventoryData, games };
  } catch (e) {
    console.error('Ошибка инициализации данных:', e);
    return {
      userData: {
        id: telegramData.userId,
        username: telegramData.username,
        photoUrl: telegramData.photoUrl || '',
        coins: 0,
        stars: 0,
        referrals: [],
        firstLogin: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        platforms: [telegramData.platform],
        onlineStatus: 'offline',
      },
      inventoryData: {
        userId: telegramData.userId,
        coins: 0,
        telegramStars: 0,
      },
      games: [],
      error: e instanceof Error ? e.message : 'Неизвестная ошибка',
    };
  }
};

// Обновление монет за онлайн
export const updateOnlineCoins = async (userId: string, currentCoins: number): Promise<InventoryData> => {
  try {
    const response = await fetch('https://nebula-server-ypun.onrender.com/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        coins: currentCoins + 1, // Добавляем 1 монету
        telegramStars: 0,
      }),
    });
    if (!response.ok) throw new Error('Ошибка обновления монет');
    return response.json();
  } catch (e) {
    console.error('Ошибка обновления монет:', e);
    return { userId, coins: currentCoins, telegramStars: 0 };
  }
};