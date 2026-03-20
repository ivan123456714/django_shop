# PC Shop — Django + React

Інтернет-магазин комп'ютерних комплектуючих на базі **Django REST Framework** (бекенд) та **React + Vite** (фронтенд).

---

## Стек технологій

| Частина | Технології |
|---|---|
| Бекенд | Django 6, Django REST Framework, SimpleJWT, CORS Headers |
| Бекенд БД | SQLite (за замовчуванням) / PostgreSQL |
| Фронтенд | React 18, Vite, React Router, Axios, Bootstrap 5 |
| Автентифікація | JWT (access 60 хв, refresh 7 днів) |

---

## Швидкий старт

### 1. Бекенд (Django)

```bash
cd backend

# Встановити залежності
pip install -r requirements.txt

# Створити .env на основі прикладу та заповнити SECRET_KEY
cp ../.env.example .env

# Застосувати міграції та створити адміна
python manage.py migrate
python manage.py createsuperuser

# Запустити сервер
python manage.py runserver   # http://127.0.0.1:8000
```

> Панель адміністратора: `http://127.0.0.1:8000/admin/`

### 2. Фронтенд (React + Vite)

```bash
cd frontend
npm install
npm run dev   # http://127.0.0.1:5173
```

> Vite автоматично проксує `/api/*` на `http://127.0.0.1:8000` — окремо нічого налаштовувати не потрібно.

---

## Структура застосунку

```
django_shop/
├── backend/
│   ├── config/       # Налаштування Django (settings, urls)
│   ├── products/     # Товари, категорії, зображення, відгуки
│   ├── orders/       # Замовлення та позиції
│   ├── users/        # Реєстрація, JWT, профіль
│   └── analytics/    # Аналітика продажів (тільки адмін)
└── frontend/
    └── src/
        ├── pages/      # Сторінки (каталог, товар, кошик, тощо)
        ├── components/ # Спільні компоненти
        ├── state/      # Глобальний стан
        └── api.js      # Axios-клієнт з JWT-інтерсептором
```

---

## API

| Endpoint | Опис |
|---|---|
| `POST /api/auth/token/` | Отримати JWT токени |
| `POST /api/auth/token/refresh/` | Оновити access token |
| `POST /api/auth/register/` | Реєстрація |
| `GET  /api/auth/me/` | Профіль поточного користувача |
| `GET  /api/products/` | Список товарів (фільтрація, пошук) |
| `GET  /api/products/<slug>/` | Деталі товару |
| `GET  /api/categories/` | Категорії |
| `GET/POST /api/orders/` | Замовлення |
| `GET  /api/admin/analytics/sales/` | Аналітика (тільки адмін) |

---

## Змінні середовища (`.env`)

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL (якщо не SQLite)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=shop_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```
