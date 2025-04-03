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
    const { userId } = telegramData;

    // 1. Проверка существования пользователя
    const userResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/user/${userId}`);
    let userData;
    if (userResponse.ok) {
      userData = await userResponse.json();
    } else if (userResponse.status === 404) {
      // Создание нового пользователя
      const newUser = {
        userId,
        username: telegramData.username || 'Гость',
        photoUrl: telegramData.photoUrl || '',
        platform: telegramData.platform || 'Неизвестно',
        isPremium: telegramData.isPremium || false,
      };
      const createUserResponse = await fetch('https://nebula-server-ypun.onrender.com/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!createUserResponse.ok) throw new Error('Ошибка создания пользователя');
      userData = await createUserResponse.json();
    } else {
      throw new Error('Ошибка загрузки данных пользователя');
    }

    // 2. Проверка и загрузка инвентаря
    const inventoryResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/inventory/${userId}`);
    let inventoryData;
    if (inventoryResponse.ok) {
      inventoryData = await inventoryResponse.json();
    } else if (inventoryResponse.status === 404) {
      // Создание нового инвентаря
      const newInventory = {
        userId,
        coins: 0,
        stars: 0,
        telegramStars: 0,
      };
      const createInventoryResponse = await fetch('https://nebula-server-ypun.onrender.com/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInventory),
      });
      if (!createInventoryResponse.ok) throw new Error('Ошибка создания инвентаря');
      inventoryData = await createInventoryResponse.json();
    } else {
      throw new Error('Ошибка загрузки инвентаря');
    }

    // 3. Получение списка игр
    const gamesResponse = await fetch('https://nebula-server-ypun.onrender.com/api/games');
    if (!gamesResponse.ok) throw new Error('Игры не доступны');
    const games = await gamesResponse.json();

    return { userData, inventoryData, games };
  } catch (e) {
    console.error('Ошибка инициализации данных:', e);
    return {
      userData: {
        id: telegramData.userId,
        username: telegramData.username || 'Гость',
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
        coins: currentCoins + 1, // Обновляем только coins
      }),
    });
    if (!response.ok) throw new Error('Ошибка обновления монет');
    return response.json();
  } catch (e) {
    console.error('Ошибка обновления монет:', e);
    return { userId, coins: currentCoins, stars: 0, telegramStars: 0, lastCoinUpdate: new Date().toISOString() };
  }
};