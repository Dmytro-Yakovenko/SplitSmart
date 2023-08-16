from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    participants = db.relationship('ExpenseParticipant', back_populates='expense', cascade="all, delete-orphan")
    user = db.relationship('User', back_populates='expenses')
    comments = db.relationship('Comment', back_populates='expense', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'amount': self.amount,
            'creator_id': self.creator_id,
            'participants': [participant.to_dict() for participant in self.participants],
            'user': self.user.to_dict(),
            'comments': [comment.to_dict() for comment in self.comments],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
