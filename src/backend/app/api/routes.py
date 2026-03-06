import os
import re
from datetime import date, timedelta
from flask import jsonify, request, session
from werkzeug.utils import secure_filename
from app import db
from app.models import User, ChildProfile, Event, EventSubscription, Purchase, Notification
from . import api_bp

UPLOAD_FOLDER = "/app/uploads/certificates"
ALLOWED_EXTENSIONS = {"pdf"}

# ──────────────────────────────────────────
# Date helpers for period filtering
# ──────────────────────────────────────────

_MONTHS_RU = {
    'январь': 1, 'января': 1,
    'февраль': 2, 'февраля': 2,
    'март': 3, 'марта': 3,
    'апрель': 4, 'апреля': 4,
    'май': 5, 'мая': 5,
    'июнь': 6, 'июня': 6,
    'июль': 7, 'июля': 7,
    'август': 8, 'августа': 8,
    'сентябрь': 9, 'сентября': 9,
    'октябрь': 10, 'октября': 10,
    'ноябрь': 11, 'ноября': 11,
    'декабрь': 12, 'декабря': 12,
}

_MONTH_RE = '|'.join(re.escape(k) for k in sorted(_MONTHS_RU, key=len, reverse=True))


def _last_day(year, month):
    if month == 12:
        return date(year + 1, 1, 1) - timedelta(days=1)
    return date(year, month + 1, 1) - timedelta(days=1)


def _extract_specific_dates(s, year):
    dates = []
    for m in re.finditer(rf'((?:\d+[,\s]+)*\d+)\s*({_MONTH_RE})', s):
        month = _MONTHS_RU[m.group(2)]
        for day in map(int, re.findall(r'\d+', m.group(1))):
            if 1 <= day <= 31:
                try:
                    dates.append(date(year, month, day))
                except ValueError:
                    pass
    return dates


def event_matches_period(date_str, period):
    if not date_str or not period:
        return True

    s = date_str.lower().strip()
    today = date.today()

    if period == 'thismonth':
        p_start, p_end = today, _last_day(today.year, today.month)
    elif period == 'thisweek':
        p_start, p_end = today, today + timedelta(days=7)
    elif period == 'weekend':
        wd = today.weekday()  # 0=Mon … 5=Sat, 6=Sun
        if wd == 6:
            sat = today - timedelta(days=1)
        elif wd == 5:
            sat = today
        else:
            sat = today + timedelta(days=(5 - wd))
        p_start, p_end = sat, sat + timedelta(days=1)
    else:
        return True

    year_m = re.search(r'\b(20\d\d)\b', s)
    year = int(year_m.group(1)) if year_m else today.year

    range_m = re.search(rf'({_MONTH_RE})[–—\-]({_MONTH_RE})', s)
    if range_m:
        r_start = date(year, _MONTHS_RU[range_m.group(1)], 1)
        r_end = _last_day(year, _MONTHS_RU[range_m.group(2)])
        return r_start <= p_end and r_end >= p_start

    specific = _extract_specific_dates(s, year)
    if specific:
        return any(p_start <= d <= p_end for d in specific)
    return True


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return None
    return db.session.get(User, user_id)


def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user():
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated


# ──────────────────────────────────────────
# Health
# ──────────────────────────────────────────

@api_bp.get("/health")
def health():
    return jsonify({"status": "ok"})


# ──────────────────────────────────────────
# Auth
# ──────────────────────────────────────────

@api_bp.post("/auth/register")
def register():
    data = request.get_json()
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Заполните все поля"}), 400
    if len(password) < 6:
        return jsonify({"error": "Пароль должен быть не менее 6 символов"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email уже зарегистрирован"}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id
    return jsonify(user.to_dict()), 201


@api_bp.post("/auth/login")
def login():
    data = request.get_json()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Неверный email или пароль"}), 401

    session["user_id"] = user.id
    return jsonify(user.to_dict())


@api_bp.post("/auth/logout")
def logout():
    session.pop("user_id", None)
    return jsonify({"status": "ok"})


@api_bp.get("/auth/me")
def me():
    user = current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(user.to_dict())


# ──────────────────────────────────────────
# Child Profile
# ──────────────────────────────────────────

@api_bp.get("/child-profile")
@login_required
def get_child_profile():
    user = current_user()
    if not user.child_profile:
        return jsonify(None)
    return jsonify(user.child_profile.to_dict())


@api_bp.post("/child-profile")
@login_required
def save_child_profile():
    user = current_user()
    data = request.get_json()

    profile = user.child_profile
    if not profile:
        profile = ChildProfile(user_id=user.id)
        db.session.add(profile)

    profile.age = data.get("age")
    profile.gender = data.get("gender")
    profile.birth_date = data.get("birth_date")
    profile.hobby = data.get("hobby")
    profile.fav_sport = data.get("fav_sport")
    profile.fav_character = data.get("fav_character")
    profile.fav_book = data.get("fav_book")
    profile.fav_food = data.get("fav_food")

    db.session.commit()
    return jsonify(profile.to_dict()), 201


# ──────────────────────────────────────────
# Recommendations
# TODO: заменить фильтрацию на ML-модель
# ──────────────────────────────────────────

@api_bp.get("/recommendations")
@login_required
def get_recommendations():
    user = current_user()
    profile = user.child_profile
    if not profile:
        return jsonify([])

    query = Event.query.filter_by(category="detjam")

    # Базовая фильтрация по возрасту (если указан)
    if profile.age:
        query = query.filter(
            Event.min_age.is_(None) | (Event.min_age <= profile.age),
            Event.max_age.is_(None) | (Event.max_age >= profile.age),
        )

    period = request.args.get('period')
    events = query.all()
    if period:
        events = [e for e in events if event_matches_period(e.date, period)]
    return jsonify([e.to_dict() for e in events])


# ──────────────────────────────────────────
# Events
# ──────────────────────────────────────────

@api_bp.get("/events/counts")
def get_event_counts():
    detjam_count = Event.query.filter_by(category="detjam").count()
    return jsonify({"detjam": detjam_count, "total": detjam_count})


@api_bp.get("/events/<int:event_id>")
def get_event(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Не найдено"}), 404
    data = event.to_dict()
    user = current_user()
    if user:
        sub = EventSubscription.query.filter_by(
            user_id=user.id, event_id=event_id
        ).first()
        data["subscribed"] = sub is not None
    else:
        data["subscribed"] = False
    return jsonify(data)


@api_bp.post("/events/<int:event_id>/buy")
@login_required
def buy_ticket(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Не найдено"}), 404
    if not event.tickets_available:
        return jsonify({"error": "Билетов нет"}), 400
    user = current_user()
    event.tickets_available -= 1
    purchase = Purchase(user_id=user.id, event_id=event_id)
    db.session.add(purchase)
    db.session.commit()
    return jsonify({"tickets_available": event.tickets_available})


@api_bp.post("/events/<int:event_id>/subscribe")
@login_required
def subscribe_event(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"error": "Не найдено"}), 404
    user = current_user()
    existing = EventSubscription.query.filter_by(
        user_id=user.id, event_id=event_id
    ).first()
    if existing:
        return jsonify({"subscribed": True})
    sub = EventSubscription(user_id=user.id, event_id=event_id)
    db.session.add(sub)
    db.session.commit()
    return jsonify({"subscribed": True}), 201


@api_bp.delete("/events/<int:event_id>/subscribe")
@login_required
def unsubscribe_event(event_id):
    user = current_user()
    sub = EventSubscription.query.filter_by(
        user_id=user.id, event_id=event_id
    ).first()
    if sub:
        db.session.delete(sub)
        db.session.commit()
    return jsonify({"subscribed": False})


# ──────────────────────────────────────────
# My Tickets
# ──────────────────────────────────────────

@api_bp.get("/my-tickets")
@login_required
def my_tickets():
    user = current_user()
    purchases = (
        Purchase.query
        .filter_by(user_id=user.id)
        .order_by(Purchase.created_at.desc())
        .all()
    )
    return jsonify([p.to_dict() for p in purchases])


@api_bp.post("/tickets/<int:purchase_id>/return")
@login_required
def return_ticket(purchase_id):
    user = current_user()
    purchase = Purchase.query.filter_by(id=purchase_id, user_id=user.id).first()
    if not purchase:
        return jsonify({"error": "Билет не найден"}), 404
    if purchase.status != "active":
        return jsonify({"error": "Билет уже возвращён"}), 400

    reason_type = request.form.get("reason_type")  # certificate | other
    reason_text = request.form.get("reason_text", "")

    if reason_type == "certificate":
        file = request.files.get("certificate")
        if not file or not allowed_file(file.filename):
            return jsonify({"error": "Прикрепите PDF-файл справки"}), 400
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filename = f"{purchase_id}_{secure_filename(file.filename)}"
        file.save(os.path.join(UPLOAD_FOLDER, filename))
    elif reason_type == "other":
        if not reason_text.strip():
            return jsonify({"error": "Укажите причину возврата"}), 400
    else:
        return jsonify({"error": "Укажите причину возврата"}), 400

    purchase.status = "returned"
    event = purchase.event
    event.tickets_available += 1

    # Уведомить подписчиков о появлении билета
    subs = EventSubscription.query.filter_by(event_id=event.id).all()
    for sub in subs:
        if sub.user_id != user.id:
            db.session.add(Notification(
                user_id=sub.user_id,
                event_id=event.id,
                message=f"Появился билет на «{event.name}»!",
            ))

    db.session.commit()
    return jsonify({"status": "returned"})


# ──────────────────────────────────────────
# Notifications
# ──────────────────────────────────────────

@api_bp.get("/notifications")
@login_required
def get_notifications():
    user = current_user()
    notifs = (
        Notification.query
        .filter_by(user_id=user.id)
        .order_by(Notification.created_at.desc())
        .limit(20)
        .all()
    )
    return jsonify([n.to_dict() for n in notifs])


@api_bp.post("/notifications/read")
@login_required
def mark_notifications_read():
    user = current_user()
    Notification.query.filter_by(user_id=user.id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"status": "ok"})
