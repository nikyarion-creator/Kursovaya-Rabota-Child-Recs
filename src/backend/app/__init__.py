import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-me")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://kurcach_user:kurcach_pass@db:3306/kurcach_db?charset=utf8mb4"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SESSION_COOKIE_HTTPONLY"] = True
    app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True)

    from .api import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()
        _seed_events()

    return app


def _seed_events():
    from .models import Event
    if Event.query.count() > 0:
        return
    db.session.add_all([
        Event(
            name="Шоу каскадёров мастера Панина «Русский форсаж»",
            date="15 марта 2026",
            place="Москва",
            price=1000,
            image="images/big.jpg",
            age_restriction="12+",
            category="detjam",
            tags="трюки,экшн,машины,шоу",
            min_age=12, max_age=17, tickets_available=50,
        ),
        Event(
            name="Весь этот цирк",
            date="март–апрель 2026",
            place="Цирк Никулина на Цветном бульваре",
            price=1500,
            image="images/big_1.jpg",
            age_restriction="6+",
            category="detjam",
            tags="цирк,животные,клоуны,представление",
            min_age=6, max_age=17, tickets_available=0,
        ),
        Event(
            name="Майнкрафт vs Роблокс: Челлендж Шоу",
            date="7, 28 марта, 4 апреля",
            place="ZooDepo",
            price=790,
            image="images/big_2.jpg",
            age_restriction="6+",
            category="detjam",
            tags="minecraft,roblox,игры,геймеры,интерактив",
            min_age=6, max_age=14, tickets_available=12,
        ),
    ])
    db.session.commit()
