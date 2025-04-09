import { Game, Referral } from '../App';

interface UserData {
  userId: string; // Используем userId вместо id
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

interface AppData {
  userData: UserData;
  inventoryData: InventoryData;
  games: Game[];
  error?: string;
}

interface App {
  id: string;
  type: 'game' | 'app';
  name: string;
  icon: string;
  shortDescription: string;
  categories?: string[];
  url?: string;
}

export const initializeAppData = async ({
  userId,
  username,
  photoUrl,
  platform,
  isPremium,
}: {
  userId: string;
  username: string;
  photoUrl: string;
  platform: string;
  isPremium: boolean;
}): Promise<AppData> => {
  const defaultUserData: UserData = {
    userId, // Используем userId вместо id
    username,
    photoUrl,
    referrals: [],
    firstLogin: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    platforms: [platform],
    onlineStatus: 'online',
    loginCount: 1,
  };

  const defaultInventoryData: InventoryData = {
    userId,
    coins: 0,
    stars: 0,
    telegramStars: 0,
    lastCoinUpdate: new Date().toISOString(),
  };

  try {
    // Проверяем, существует ли пользователь
    console.log('Fetching user with userId:', userId);
    const userResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/users/${userId}`);
    let userData = defaultUserData;
    let inventoryData = defaultInventoryData;

    if (userResponse.ok) {
      const existingUser = await userResponse.json();
      console.log('Found existing user:', existingUser);
      userData = {
        ...existingUser,
        lastLogin: new Date().toISOString(),
        loginCount: existingUser.loginCount + 1,
        platforms: existingUser.platforms.includes(platform)
          ? existingUser.platforms
          : [...existingUser.platforms, platform],
        onlineStatus: 'online',
      };

      console.log('Fetching inventory for userId:', userId);
      const inventoryResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/inventory/${userId}`);
      if (inventoryResponse.ok) {
        inventoryData = await inventoryResponse.json();
        console.log('Found inventory:', inventoryData);
      }
    } else {
      // Создаём нового пользователя
      console.log('Creating new user with userId:', userId);
      const createUserResponse = await fetch('https://nebula-server-ypun.onrender.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!createUserResponse.ok) {
        throw new Error('Ошибка создания пользователя');
      }

      // Создаём инвентарь
      console.log('Creating inventory for userId:', userId);
      const createInventoryResponse = await fetch('https://nebula-server-ypun.onrender.com/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryData),
      });

      if (!createInventoryResponse.ok) {
        throw new Error('Ошибка создания инвентаря');
      }
    }

    // Получаем данные приложений из API
    console.log('Fetching apps');
    const appsResponse = await fetch('https://nebula-server-ypun.onrender.com/api/apps');
    if (!appsResponse.ok) {
      throw new Error('Ошибка загрузки приложений');
    }
    const appsData = await appsResponse.json();
    console.log('Received apps:', appsData);

    // Фильтруем только игры для совместимости с текущей логикой
    const games: Game[] = appsData
      .filter((app: App) => app.type === 'game')
      .map((app: App) => ({
        id: app.id,
        name: app.name,
        type: app.categories && app.categories.length > 0 ? app.categories[0] : 'unknown',
        url: app.url || '#',
        imageUrl: app.icon,
        description: app.shortDescription,
      }));

    return {
      userData,
      inventoryData,
      games,
    };
  } catch (error: any) {
    console.error('Ошибка инициализации данных:', error);
    return {
      userData: defaultUserData,
      inventoryData: defaultInventoryData,
      games: [],
      error: error.message || 'Неизвестная ошибка',
    };
  }
};

export const updateOnlineCoins = async (userId: string, currentCoins: number): Promise<InventoryData> => {
  try {
    console.log('Updating online coins for userId:', userId);
    const response = await fetch(`https://nebula-server-ypun.onrender.com/api/inventory/${userId}`);
    if (!response.ok) {
      throw new Error('Ошибка получения инвентаря');
    }
    const inventoryData = await response.json();

    const now = new Date();
    const lastUpdate = new Date(inventoryData.lastCoinUpdate);
    const timeDiff = (now.getTime() - lastUpdate.getTime()) / 1000; // Разница в секундах

    if (timeDiff >= 10) {
      const newCoins = currentCoins + 1;
      const updateResponse = await fetch(`https://nebula-server-ypun.onrender.com/api/inventory/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coins: newCoins,
          lastCoinUpdate: now.toISOString(),
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Ошибка обновления монет');
      }

      return await updateResponse.json();
    }

    return inventoryData;
  } catch (error) {
    console.error('Ошибка обновления монет:', error);
    return {
      userId,
      coins: currentCoins,
      stars: 0,
      telegramStars: 0,
      lastCoinUpdate: new Date().toISOString(),
    };
  }
};