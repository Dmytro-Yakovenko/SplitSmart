from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone_number = db.Column(db.String(10), unique=True)
    image_url = db.Column(db.String(255), nullable=False, default="https://i.ibb.co/nLrYRrP/default.png")
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    expenses = db.relationship('Expense', back_populates='user')
    comments = db.relationship('Comment', back_populates='user')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': f"{self.first_name} {self.last_name}",
            'short_name': f"{self.first_name} {self.last_name[0]}.",
            'email': self.email,
            'phone_number': self.phone_number,
            'image_url': self.image_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
