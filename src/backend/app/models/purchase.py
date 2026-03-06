from datetime import datetime
from app import db


class Purchase(db.Model):
    __tablename__ = "purchases"

    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id   = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    status     = db.Column(db.String(20), default="active")  # active | returned
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user  = db.relationship("User",  backref="purchases")
    event = db.relationship("Event", backref="purchases")

    def to_dict(self):
        return {
            "id":         self.id,
            "event":      self.event.to_dict(),
            "status":     self.status,
            "created_at": self.created_at.isoformat(),
        }
