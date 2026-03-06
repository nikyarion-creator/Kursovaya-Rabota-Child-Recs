from app import db


class ChildProfile(db.Model):
    __tablename__ = "child_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)

    age = db.Column(db.Integer)
    gender = db.Column(db.String(1))          # М / Ж
    birth_date = db.Column(db.String(20))     # дд.мм.гг
    hobby = db.Column(db.String(200))
    fav_sport = db.Column(db.String(100))
    fav_character = db.Column(db.String(100))
    fav_book = db.Column(db.String(100))
    fav_food = db.Column(db.String(100))

    user = db.relationship("User", back_populates="child_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "age": self.age,
            "gender": self.gender,
            "birth_date": self.birth_date,
            "hobby": self.hobby,
            "fav_sport": self.fav_sport,
            "fav_character": self.fav_character,
            "fav_book": self.fav_book,
            "fav_food": self.fav_food,
        }
