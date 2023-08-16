from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod


class ExpenseParticipant(db.Model):
    __tablename__ = 'expense_participants'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')), nullable=False)
    friendship_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('friendships.id')), nullable=False)
    amount_due = db.Column(db.Numeric, nullable=False)
    is_settled = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    expense = db.relationship('Expense', back_populates='participants')
    friendship = db.relationship('Friendship', back_populates='expenses')

    def to_dict(self):
        return {
            'id': self.id,
            'expense_id': self.expense_id,
            'friendship_id': self.friendship_id,
            'amount_due': self.amount_due,
            'is_settled': self.is_settled,
            'friendship': self.friendship.to_dict(),
            'expense': {
                'id': self.expense.id,
                'description': self.expense.description,
                'amount': self.expense.amount,
                'creator_id': self.expense.creator_id,
                'user': self.expense.user.to_dict(),
                'comments': [comment.to_dict() for comment in self.expense.comments],
                'participants': [{
                    'id': participant.id,
                    'friendship': participant.friendship.to_dict(),
                    'amount_due': participant.amount_due
                } for participant in self.expense.participants],
                'created_at': self.expense.created_at,
                'updated_at': self.expense.updated_at
            },
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
