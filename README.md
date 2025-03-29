# Nebula Frontend

Фронтенд для Telegram Mini App Nebula - игрового портала в Telegram.

## Особенности

- Интеграция с Telegram Mini App SDK 3.5.3
- Полноэкранный режим и защита от свайпа вниз
- Адаптивный дизайн для мобильных устройств
- Интеграция с бэкендом

## Установка

```bash
# Клонировать репозиторий
git clone https://github.com/pavelromci25/nebula-frontend.git
cd nebula-frontend

# Установить зависимости
npm install

# Запустить в режиме разработки
npm start
```

## Скрипты

- `npm start` - Запустить в режиме разработки
- `npm run build` - Собрать для продакшена
- `npm run deploy` - Деплой на GitHub Pages

## Деплой

Для деплоя на GitHub Pages:

```bash
npm run deploy
```

## Структура проекта

```
nebula-frontend/
├── public/              # Статические файлы
├── src/                 # Исходный код
│   ├── components/      # Компоненты React
│   ├── hooks/           # Пользовательские хуки
│   ├── App.tsx          # Главный компонент
│   ├── App.css          # Стили
│   ├── index.tsx        # Точка входа
│   └── index.css        # Глобальные стили
└── package.json         # Зависимости
```

## Требования

- Node.js 14+
- NPM 6+