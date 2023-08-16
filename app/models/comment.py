from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    expense = db.relationship('Expense', back_populates='comments')
    user = db.relationship('User', back_populates='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'comment': self.comment,
            'user_id': self.user_id,
            'expense_id': self.expense_id,
            'user': self.user.to_dict(),
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
