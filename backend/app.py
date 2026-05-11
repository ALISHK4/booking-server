import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from email_service import send_reservation_email


_DOTENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=_DOTENV_PATH)
print(f"[dotenv] path={_DOTENV_PATH} exists={os.path.exists(_DOTENV_PATH)}")
print("[env] keys:", {k: (os.environ.get(k)[:3] + "***" if os.environ.get(k) else None) for k in [
    "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "TO_EMAIL", "SMTP_USE_TLS"
]})


# Инициализация SQLAlchemy (глобально), чтобы модель могла ссылаться на экземпляр
db = SQLAlchemy()


class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(255), nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    date = db.Column(db.String(255), nullable=False)
    destination = db.Column(db.String(255), nullable=False)


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["JSON_AS_ASCII"] = False
    # Разрешаем CORS для фронтенда на file:// и localhost
    CORS(app, resources={r"/*": {"origins": ["*"]}})

    # Настройка БД SQLite: файл reservations.db в корне проекта
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    db_path = os.path.join(project_root, "reservations.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Инициализируем БД
    db.init_app(app)

    # Создаём таблицы при старте приложения
    with app.app_context():
        db.create_all()

    @app.get("/health")
    def health() -> tuple:
        return jsonify({"status": "ok"}), 200

    @app.post("/api/reservations")
    def create_reservation() -> tuple:
        data = request.get_json(silent=True) or request.form.to_dict()
        name = data.get("Name", "").strip()
        phone = data.get("Number", "").strip()
        guests = data.get("Guests", "").strip()
        date = data.get("date", "").strip()
        destination = data.get("Destination", "").strip()

        missing = [k for k, v in {
            "Name": name,
            "Number": phone,
            "Guests": guests,
            "date": date,
            "Destination": destination,
        }.items() if not v]
        if missing:
            return jsonify({"ok": False, "error": f"Отсутствуют поля: {', '.join(missing)}"}), 400

        # Сохраняем в БД, затем отправляем письмо
        try:
            guests_int = int(guests)
        except ValueError:
            return jsonify({"ok": False, "error": "Поле Guests должно быть числом"}), 400

        try:
            reservation = Reservation(
                name=name,
                phone=phone,
                guests=guests_int,
                date=date,
                destination=destination,
            )
            db.session.add(reservation)
            db.session.commit()
        except Exception as exc:
            db.session.rollback()
            return jsonify({"ok": False, "error": f"Ошибка сохранения в БД: {exc}"}), 500

        try:
            send_reservation_email(
                name=name,
                phone=phone,
                guests=str(guests),
                date=date,
                destination=destination,
            )
            return jsonify({"ok": True, "message": "Бронирование отправлено"}), 200
        except Exception as exc:
            return jsonify({"ok": False, "error": str(exc)}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

