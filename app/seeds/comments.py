from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_comments():

    comment1_1 = Comment(
        comment='this is for yesterday\'s dinner', user_id=1, expense_id=1)
    comment1_2 = Comment(
        comment='will send it over soon!', user_id=2, expense_id=1)
    comment1_3 = Comment(
        comment='no problem, no rush', user_id=1, expense_id=1)
    comment2_1 = Comment(
        comment='the snacks were yummy', user_id=3, expense_id=2)
    comment2_2 = Comment(
        comment='i agree, they were the best', user_id=4, expense_id=2)
    comment2_3 = Comment(
        comment='i enjoyed them, too!', user_id=1, expense_id=2)
    comment3_1 = Comment(
        comment='disneyland was so fun', user_id=2, expense_id=3)
    comment3_2 = Comment(
        comment='happiest place on earth, absolutely!', user_id=1, expense_id=3)
    comment3_3 = Comment(
        comment='so expensive tho, i\'ll send the $$ in a month or so', user_id=3, expense_id=3)
    comment4_1 = Comment(
        comment='was this juice it up or jamba juice', user_id=4, expense_id=4)
    comment4_2 = Comment(
        comment='neither, we went to pressed', user_id=1, expense_id=4)
    comment5_1 = Comment(
        comment='spotify plan fees', user_id=5, expense_id=5)
    comment6_1 = Comment(
        comment='when was this??', user_id=4, expense_id=6)

    db.session.add_all([
        comment1_1, comment1_2, comment1_3,
        comment2_1, comment2_2, comment2_3,
        comment3_1, comment3_2, comment3_3,
        comment4_1, comment4_2,
        comment5_1,
        comment6_1
    ])
    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
