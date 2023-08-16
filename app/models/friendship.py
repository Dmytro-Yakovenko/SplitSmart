from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Friendship(db.Model):
    __tablename__ = 'friendships'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    bill = db.Column(db.Numeric, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', foreign_keys=[user_id])
    friend = db.relationship('User', foreign_keys=[friend_id])
    expenses = db.relationship('ExpenseParticipant', back_populates='friendship')
    payments = db.relationship('Payment', back_populates='friendship')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'friend_id': self.friend_id,
            'bill': self.bill,
            'is_active': self.is_active,
            'user': self.user.to_dict(),
            'friend': self.friend.to_dict(),
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
