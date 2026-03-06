from app import db


class Event(db.Model):
    __tablename__ = "events"

    id              = db.Column(db.Integer, primary_key=True)
    name            = db.Column(db.String(300), nullable=False)
    date            = db.Column(db.String(100))
    place           = db.Column(db.String(200))
    price           = db.Column(db.Integer)
    image           = db.Column(db.String(300))
    age_restriction = db.Column(db.String(10))

    # Поля для будущей ML-фильтрации по анкете
    category          = db.Column(db.String(50))
    tags              = db.Column(db.String(500))
    min_age           = db.Column(db.Integer)
    max_age           = db.Column(db.Integer)
    tickets_available = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id":                 self.id,
            "name":               self.name,
            "date":               self.date,
            "place":              self.place,
            "price":              self.price,
            "image":              self.image,
            "age_restriction":    self.age_restriction,
            "category":           self.category,
            "tags":               self.tags,
            "min_age":            self.min_age,
            "max_age":            self.max_age,
            "tickets_available":  self.tickets_available,
        }
