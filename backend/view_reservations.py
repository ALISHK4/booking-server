import os
from app import db, create_app
from app import Reservation  # модель, которую мы добавляли в app.py

# Создаём приложение и контекст
app = create_app()
app.app_context().push()

def show_reservations():
    reservations = Reservation.query.all()
    if not reservations:
        print("⛔ В базе пока нет заявок.")
        return

    print("📋 Заявки из базы данных:")
    for r in reservations:
        print(
            f"ID: {r.id} | Name: {r.name} | Phone: {r.phone} | Guests: {r.guests} | "
            f"Date: {r.date} | Destination: {r.destination}"
        )

if __name__ == "__main__":
    show_reservations()
