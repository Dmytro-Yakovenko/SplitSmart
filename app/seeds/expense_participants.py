from app.models import db, ExpenseParticipant, environment, SCHEMA
from sqlalchemy.sql import text

# friendship1 demo->aurora
# friendship2 demo->justin
# friendship3 demo->dmytro

# demo to expense $100 -> self, aurora
# demo to expense $60 -> self, justin, dmytro
# demo to expense $300 -> self, aurora, justin
# demo to expense $10 -> self, dmytro

def seed_expense_participants():

    expense1_1 = ExpenseParticipant(
        expense_id=1, friendship_id=1, amount_due=50)
    expense2_1 = ExpenseParticipant(
        expense_id=2, friendship_id=2, amount_due=20)
    expense2_2 = ExpenseParticipant(
        expense_id=2, friendship_id=3, amount_due=20)
    expense3_1 = ExpenseParticipant(
        expense_id=3, friendship_id=1, amount_due=100)
    expense3_2 = ExpenseParticipant(
        expense_id=3, friendship_id=2, amount_due=100)
    expense4_1 = ExpenseParticipant(
        expense_id=4, friendship_id=3, amount_due=5)
    expense5_1 = ExpenseParticipant(
        expense_id=5, friendship_id=21, amount_due=30)
    expense5_2 = ExpenseParticipant(
        expense_id=5, friendship_id=23, amount_due=30)
    expense5_3 = ExpenseParticipant(
        expense_id=5, friendship_id=25, amount_due=30)
    expense6_1 = ExpenseParticipant(
        expense_id=6, friendship_id=29, amount_due=10)

    db.session.add_all([
        expense1_1,
        expense2_1, expense2_2,
        expense3_1, expense3_2,
        expense4_1,
        expense5_1, expense5_2, expense5_3,
        expense6_1
    ])
    db.session.commit()


def undo_expense_participants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expense_participants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expense_participants"))

    db.session.commit()
