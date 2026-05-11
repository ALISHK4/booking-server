import os

import resend
from dotenv import load_dotenv


def _load_env() -> None:
    for candidate in [
        os.path.join(os.path.dirname(__file__), ".env"),
        os.path.join(os.path.dirname(__file__), "..", ".env"),
        "/etc/secrets/.env",
    ]:
        if os.path.exists(candidate):
            load_dotenv(dotenv_path=candidate)
            break


def send_reservation_email(
    *, name: str, phone: str, guests: str, date: str, destination: str
) -> None:
    _load_env()

    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("Не установлена переменная окружения RESEND_API_KEY")

    to_email = os.environ.get("TO_EMAIL", "").strip()
    if not to_email:
        raise RuntimeError("Не установлена переменная окружения TO_EMAIL")

    from_email = os.environ.get("FROM_EMAIL", "onboarding@resend.dev").strip()

    resend.api_key = api_key

    body = (
        f"Имя: {name}\n"
        f"Телефон: {phone}\n"
        f"Гостей: {guests}\n"
        f"Дата: {date}\n"
        f"Направление: {destination}\n"
    )

    params = {
        "from": from_email,
        "to": [to_email],
        "subject": "Новое бронирование",
        "text": body,
    }

    response = resend.Emails.send(params)
    print(f"Письмо отправлено, id: {response['id']}")
