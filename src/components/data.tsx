import { Game, Referral } from '../App';

interface UserData {
  id: string;
  username: string;
  photoUrl: string;
  referrals: Referral[];
  firstLogin: string;
  lastLogin: string;
  platforms: string[];
  onlineStatus: string;
  loginCount: number;
}

interface InventoryData {
  userId: string;
  coins: number;
  stars: number;
  telegramStars: number;
  lastCoinUpdate: string;
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
  telegramData: TelegramData
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
      }),
    });
    if (!updateUserResponse.ok) throw new Error('Ошибка обновления данных пользователя');
    const userData = await updateUserResponse.json();

    // Получение или создание инвентаря
    const inventoryResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/inventory/${telegramData.userId}`);
    let inventoryData;
    if (inventoryResponse.ok) {
      inventoryData = await inventoryResponse.json();
    } else {
      const initInventoryResponse = await fetch('https://nebula-server-ypun.onrender.com/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: telegramData.userId,
          coins: 0,
          stars: 0,
          telegramStars: 0,
        }),
      });
      if (!initInventoryResponse.ok) throw new Error('Ошибка создания инвентаря');
      inventoryData = await initInventoryResponse.json();
    }

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
        referrals: [],
        firstLogin: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        platforms: [telegramData.platform],
        onlineStatus: 'offline',
        loginCount: 0,
      },
      inventoryData: {
        userId: telegramData.userId,
        coins: 0,
        stars: 0,
        telegramStars: 0,
        lastCoinUpdate: new Date().toISOString(),
      },
      games: [],
      error: e instanceof Error ? e.message : 'Неизвестная ошибка',
    };
  }
};

export const updateOnlineCoins = async (userId: string, currentCoins: number): Promise<InventoryData> => {
  try {
    const response = await fetch('https://nebula-server-ypun.onrender.com/api/inventory/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        coins: currentCoins + 1,
        stars: 0,
        telegramStars: 0,
      }),
    });
    if (!response.ok) throw new Error('Ошибка обновления монет');
    return response.json();
  } catch (e) {
    console.error('Ошибка обновления монет:', e);
    return { userId, coins: currentCoins, stars: 0, telegramStars: 0, lastCoinUpdate: new Date().toISOString() };
  }
};