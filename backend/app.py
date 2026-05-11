import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

try:
    from backend.email_service import send_reservation_email
except ImportError:
    from email_service import send_reservation_email

# Ищем .env в нескольких местах: backend/, корень проекта, /etc/secrets/ (Render)
_DOTENV_CANDIDATES = [
    os.path.join(os.path.dirname(__file__), ".env"),  # backend/.env
    os.path.join(os.path.dirname(__file__), "..", ".env"),  # корень проекта
    "/etc/secrets/.env",  # Render Secret Files
]

_DOTENV_PATH = None
for _candidate in _DOTENV_CANDIDATES:
    if os.path.exists(_candidate):
        _DOTENV_PATH = _candidate
        break

if _DOTENV_PATH:
    load_dotenv(dotenv_path=_DOTENV_PATH)
    print(f"[dotenv] загружен из: {_DOTENV_PATH}")
else:
    print("[dotenv] .env файл не найден, используются переменные окружения системы")
print(
    "[env] keys:",
    {
        k: (os.environ.get(k)[:3] + "***" if os.environ.get(k) else None)
        for k in ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "TO_EMAIL", "SMTP_USE_TLS"]
    },
)


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

    CORS(app, resources={r"/*": {"origins": ["*"]}})

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    db_path = os.path.join(project_root, "reservations.db")

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.get("/")
    def index():
        return jsonify({"status": "ok", "message": "Booking API is running"}), 200

    @app.get("/health")
    def health():
        print("HEALTH CHECK OK")
        return jsonify({"status": "ok"}), 200

    @app.post("/api/reservations")
    def create_reservation():
        data = request.get_json(silent=True) or request.form.to_dict()

        print("🔥 NEW REQUEST:", data)

        name = data.get("Name", "").strip()
        phone = data.get("Number", "").strip()
        guests = data.get("Guests", "").strip()
        date = data.get("date", "").strip()
        destination = data.get("Destination", "").strip()

        missing = [
            k
            for k, v in {
                "Name": name,
                "Number": phone,
                "Guests": guests,
                "date": date,
                "Destination": destination,
            }.items()
            if not v
        ]

        if missing:
            print("❌ Missing fields:", missing)
            return jsonify(
                {"ok": False, "error": f"Отсутствуют поля: {', '.join(missing)}"}
            ), 400

        try:
            guests_int = int(guests)
        except ValueError:
            return jsonify({"ok": False, "error": "Guests должно быть числом"}), 400

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
            print("💾 Saved to DB")
        except Exception as exc:
            db.session.rollback()
            print("❌ DB ERROR:", exc)
            return jsonify({"ok": False, "error": str(exc)}), 500

        try:
            send_reservation_email(
                name=name,
                phone=phone,
                guests=guests,
                date=date,
                destination=destination,
            )
            print("📧 Email отправлен")
        except Exception as exc:
            print("❌ EMAIL ERROR:", exc)
            return jsonify(
                {"ok": False, "error": f"Ошибка отправки письма: {exc}"}
            ), 500

        return jsonify({"ok": True, "message": "Бронирование отправлено"}), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
