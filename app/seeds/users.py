from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():

    demo = User(
        first_name='Demo', last_name='Lition', email='demo@aa.io', password='password')
    aurora = User(
        first_name='Aurora', last_name='Ignacio', email='aurora@aa.io', phone_number='1234567890', image_url='https://i.ibb.co/12v3w7R/aurora.jpg', password='password')
    justin = User(
        first_name='Justin', last_name='Duncan', email='justin@aa.io', phone_number='0987654321', image_url='https://i.ibb.co/GdLD0Gr/justin.jpg', password='password')
    dmytro = User(
        first_name='Dmytro', last_name='Yakovenko', email='dmytro@aa.io', password='password')
    will = User(
        first_name='Will', last_name='Duffy', email='will@aa.io', image_url='https://i.ibb.co/XZhMd26/will.jpg', password='password')
    anthony = User(
        first_name='Anthony', last_name='Rodriguez', email='anthony@aa.io', phone_number='2468101214', password='password')

    db.session.add_all([
        demo, aurora, justin, dmytro, will, anthony
    ])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
