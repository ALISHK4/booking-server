# Woox Travel Backend (Flask + Resend)

Почта отправляется через [Resend](https://resend.com) (HTTP API), без SMTP — так сервисы вроде Render не блокируют исходящую почту.

## Переменные окружения

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `RESEND_API_KEY` | да | Ключ из раздела API Keys в Resend (`re_...`). На Render — в Environment или Secret File. |
| `TO_EMAIL` | да | Куда приходят уведомления о бронировании (ваш личный ящик). |
| `FROM_EMAIL` | нет | Отправитель. По умолчанию `onboarding@resend.dev` (только для тестов). Для «с корпоративного» добавьте и верифицируйте домен в Resend и укажите адрес на этом домене, например `bookings@ваш-домен.ru`. |

Локально можно положить значения в `backend/.env` или в `.env` в корне проекта (см. список путей в `app.py`).

## Запуск локально

1. Python 3.10+
2. `pip install -r backend/requirements.txt`
3. Пример PowerShell:

```powershell
$env:RESEND_API_KEY="re_xxxxxxxx"
$env:TO_EMAIL="you@example.com"
$env:FROM_EMAIL="onboarding@resend.dev"
$env:PORT="5000"
python backend/app.py
```

## Эндпоинты

- GET `http://localhost:5000/health`
- POST `http://localhost:5000/api/reservations`

Тело POST (JSON):

```json
{
  "Name": "Иван Иванов",
  "Number": "+7 900 000-00-00",
  "Guests": "3",
  "date": "2025-12-20",
  "Destination": "Швейцария, Лозанна"
}
```
