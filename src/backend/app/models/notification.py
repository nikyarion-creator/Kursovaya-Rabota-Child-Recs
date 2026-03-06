from datetime import datetime
from app import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id   = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    message    = db.Column(db.String(500), nullable=False)
    is_read    = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    event = db.relationship("Event")

    def to_dict(self):
        return {
            "id":         self.id,
            "event_id":   self.event_id,
            "event_name": self.event.name if self.event else None,
            "message":    self.message,
            "is_read":    self.is_read,
            "created_at": self.created_at.isoformat(),
        }
