## PC Shop (Django + React)

### 1. Бекенд (Django)

```bash
cd backend
../venv/Scripts/python.exe manage.py runserver
```

Рекомендовано створити `.env` на основі `.env.example`.

Створити адміністратора:

```bash
cd backend
../venv/Scripts/python.exe manage.py createsuperuser
```

Панель адміністратора: `http://127.0.0.1:8000/admin/`

### 2. Фронтенд (React + Vite)

У вашому звичайному терміналі (де є Node.js та npm) виконайте:

```bash
cd frontend
npm install
npm run dev
```

Після запуску:

- фронтенд: `http://127.0.0.1:5173`
- API бекенду прокситься як `/api/*` (налаштовано у `vite.config.mts`).

