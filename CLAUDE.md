# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

Always respond in Ukrainian, regardless of the language the user writes in.

---

## Project Overview

Інтернет-магазин побудований на **Django 6 + Django REST Framework** (бекенд) та **React + Vite** (фронтенд). Обидва сервери запускаються окремо: Vite проксує всі запити `/api/*` на Django (порт 8000).

---

## Django Backend

### Структура проєкту

```
backend/
├── config/             # Налаштування проєкту (settings, urls, wsgi, asgi)
├── products/           # Товари, категорії, зображення, відгуки
├── orders/             # Замовлення та позиції замовлень
├── users/              # Реєстрація, JWT-автентифікація, профіль
├── analytics/          # Аналітика продажів і логування адмін-дій
├── media/              # Завантажені зображення товарів
├── manage.py
└── requirements.txt
```

### Команди розробки

```bash
cd backend

# Перший запуск
pip install -r requirements.txt
cp ../.env.example .env        # заповнити SECRET_KEY, DB_* за потреби

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver     # http://127.0.0.1:8000
```

### Тести

```bash
cd backend
python manage.py test                          # всі тести
python manage.py test products                 # один застосунок
python manage.py test products.tests.MyTest    # один тест-кейс
```

> Тестові файли (`tests.py`) існують у кожному застосунку, але ще порожні — готові до заповнення.

### Налаштування (`config/settings.py`)

| Параметр | За замовчуванням | Змінна `.env` |
|---|---|---|
| База даних | SQLite (`db.sqlite3`) | `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` |
| JWT access token | 60 хвилин | — |
| JWT refresh token | 7 днів | — |
| CORS | AllowAll | — |
| DEBUG | `True` | `DEBUG` |
| ALLOWED_HOSTS | `*` у DEBUG | `ALLOWED_HOSTS` |

Конфігурація зчитується через `python-decouple` з файлу `.env`.
За замовчуванням `DEFAULT_PERMISSION_CLASSES = AllowAny` — права перевизначаються у кожному ViewSet окремо.

---

## Моделі та бізнес-логіка

### `products` — Товари

| Модель | Опис |
|---|---|
| `Category` | Ієрархічна категорія (`parent` FK на себе, `children` related_name) |
| `Product` | Товар: ціна, стара ціна, залишок (`stock`), прапори `is_active`/`is_promo`, технічні характеристики (`socket`, `frequency`, `memory_type`) та довільні `specs` (JSONField) |
| `ProductImage` | Зображення товару, прапор `is_main` |
| `Review` | Відгук користувача з рейтингом і коментарем |

Пошук продуктів за slug (`lookup_field = "slug"`). Фільтрація: категорія, бренд, діапазон цін, `socket`, `memory_type`, текстовий пошук, промо.

### `orders` — Замовлення

| Модель | Опис |
|---|---|
| `Order` | Замовлення з контактними даними (ім'я, телефон, email, адреса, місто, спосіб оплати) та статусами |
| `OrderItem` | Позиція замовлення: знімок ціни на момент покупки + кількість |

**Важливо:** при створенні `OrderItem` автоматично зменшується `Product.stock`.
Статуси замовлення: `new` → `processing` → `shipped` → `done` / `cancelled`.
Персонал бачить усі замовлення; звичайні користувачі — лише свої (перевизначений `get_queryset()`).

### `users` — Користувачі

Використовується стандартна модель Django `User` через `get_user_model()`.

### `analytics` — Аналітика

- `SalesAnalyticsView` (лише `IsAdminUser`): фільтрація за `date_from`/`date_to`, повертає кількість замовлень, виручку та топ-5 категорій за кількістю.
- `log_admin_action(user, action, model, payload)` — утиліта для запису `AdminLog`; викликається з `admin.py` застосунків `products` і `orders`.

---

## API Endpoints

| Метод | URL | Опис |
|---|---|---|
| POST | `/api/auth/token/` | Отримати JWT (access + refresh) |
| POST | `/api/auth/token/refresh/` | Оновити access token |
| POST | `/api/auth/register/` | Реєстрація нового користувача |
| GET | `/api/auth/me/` | Профіль поточного користувача |
| GET/POST | `/api/products/` | Список товарів / створення |
| GET/PATCH | `/api/products/<slug>/` | Деталі / редагування товару |
| GET/POST | `/api/categories/` | Категорії |
| GET/POST | `/api/orders/` | Замовлення |
| GET/POST | `/api/reviews/` | Відгуки |
| GET | `/api/admin/analytics/sales/` | Аналітика (тільки адмін) |
| — | `/admin/` | Django Admin Panel |

---

## Автентифікація

1. `POST /api/auth/token/` → отримати `access` (60 хв) та `refresh` (7 днів) токени.
2. Передавати `Authorization: Bearer <access_token>` у заголовку.
3. Оновлення: `POST /api/auth/token/refresh/` з полем `refresh`.
4. Фронтенд зберігає токени в `localStorage`; Axios-інтерсептор (`frontend/src/api.js`) додає заголовок автоматично.

---

## React Frontend

```bash
cd frontend
npm install
npm run dev     # http://127.0.0.1:5173
npm run lint
```

Vite проксує `/api/*` → `http://127.0.0.1:8000` (налаштовано у `vite.config.mts`).
Маршрути: `/`, `/catalog`, `/product/:slug`, `/cart`, `/checkout`, `/admin/orders`, `/login`, `/register`.
