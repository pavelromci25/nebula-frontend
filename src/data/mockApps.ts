export interface App {
  id: string;
  type: 'game' | 'app'; // Добавляем тип
  name: string;
  icon: string;
  banner?: string;
  shortDescription: string;
  longDescription: string;
  categories: string[];
  geo?: string; // Добавляем гео
  developer: string;
  rating: number;
  catalogRating: number;
  telegramStars: number;
  opens: number;
  platforms: string[];
  ageRating: string;
  inAppPurchases: boolean;
  dateAdded: string;
  gallery: string[];
  video?: string;
}

export const mockApps: App[] = [
  {
    id: "1",
    type: "game",
    name: "Тетрис",
    icon: "https://via.placeholder.com/80",
    banner: "https://via.placeholder.com/300x150",
    shortDescription: "Классическая игра-головоломка.",
    longDescription: "Тетрис — легендарная игра-головоломка, где вам нужно складывать падающие блоки, чтобы заполнить ряды и набрать очки. Играйте и соревнуйтесь с друзьями!",
    categories: ["Пазлы", "Классика"],
    geo: "Россия",
    developer: "Tetris Inc.",
    rating: 4.5,
    catalogRating: 4.8,
    telegramStars: 150,
    opens: 1200,
    platforms: ["iOS", "Android", "Web"],
    ageRating: "3+",
    inAppPurchases: false,
    dateAdded: "2025-03-01",
    gallery: ["https://via.placeholder.com/300", "https://via.placeholder.com/300"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "2",
    type: "game",
    name: "Змейка",
    icon: "https://via.placeholder.com/80",
    banner: "https://via.placeholder.com/300x150",
    shortDescription: "Классическая аркада.",
    longDescription: "Змейка — аркадная игра, где вы управляете змейкой, собирая еду и избегая столкновений. Сможете ли вы побить рекорд?",
    categories: ["Аркады", "Классика"],
    geo: "США",
    developer: "Snake Games",
    rating: 4.2,
    catalogRating: 4.5,
    telegramStars: 80,
    opens: 900,
    platforms: ["Web"],
    ageRating: "3+",
    inAppPurchases: true,
    dateAdded: "2025-04-01",
    gallery: ["https://via.placeholder.com/300"],
  },
  {
    id: "3",
    type: "game",
    name: "Пазлы 2048",
    icon: "https://via.placeholder.com/80",
    banner: "https://via.placeholder.com/300x150",
    shortDescription: "Собирайте числа и достигайте 2048!",
    longDescription: "2048 — увлекательная головоломка, где вы соединяете числа, чтобы достичь 2048. Проверьте свои математические навыки!",
    categories: ["Пазлы", "Логические"],
    geo: "Германия",
    developer: "2048 Games",
    rating: 4.7,
    catalogRating: 4.9,
    telegramStars: 200,
    opens: 1500,
    platforms: ["iOS", "Android"],
    ageRating: "6+",
    inAppPurchases: false,
    dateAdded: "2025-02-15",
    gallery: ["https://via.placeholder.com/300", "https://via.placeholder.com/300", "https://via.placeholder.com/300"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "4",
    type: "app",
    name: "Словесный Бой",
    icon: "https://via.placeholder.com/80",
    banner: "https://via.placeholder.com/300x150",
    shortDescription: "Составляйте слова и побеждайте!",
    longDescription: "Словесный Бой — игра, где вы соревнуетесь с другими игроками, составляя слова из букв. Улучшайте свой словарный запас и побеждайте!",
    categories: ["Словесные", "Мультиплеер"],
    geo: "Россия",
    developer: "Word Games",
    rating: 4.0,
    catalogRating: 4.3,
    telegramStars: 50,
    opens: 600,
    platforms: ["iOS", "Android", "Web"],
    ageRating: "12+",
    inAppPurchases: true,
    dateAdded: "2025-03-20",
    gallery: ["https://via.placeholder.com/300"],
  },
  {
    id: "5",
    type: "app",
    name: "Шахматы Онлайн",
    icon: "https://via.placeholder.com/80",
    banner: "https://via.placeholder.com/300x150",
    shortDescription: "Играйте в шахматы с друзьями.",
    longDescription: "Шахматы Онлайн — играйте в классические шахматы с друзьями или случайными соперниками. Улучшайте свои навыки и станьте мастером!",
    categories: ["Настольные", "Мультиплеер"],
    geo: "США",
    developer: "Chess Masters",
    rating: 4.8,
    catalogRating: 4.7,
    telegramStars: 120,
    opens: 1000,
    platforms: ["Web"],
    ageRating: "6+",
    inAppPurchases: false,
    dateAdded: "2025-01-10",
    gallery: ["https://via.placeholder.com/300", "https://via.placeholder.com/300"],
  },
];