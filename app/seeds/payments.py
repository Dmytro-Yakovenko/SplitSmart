from app.models import db, Payment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_payments():

    #demo payments
    payment1 = Payment(friendship_id=1, amount=50.00)
    payment2 = Payment(friendship_id=2, amount=75.00)
    payment3 = Payment(friendship_id=3, amount=100.00)
    payment4 = Payment(friendship_id=4,amount=50.00)
    payment5 = Payment(friendship_id=5, amount=75.00)

    #aurora payments
    payment6 = Payment(friendship_id=6, amount=100.00)
    payment7 = Payment(friendship_id=7, amount=50.00)
    payment8 = Payment(friendship_id=8, amount=75.00)
    payment9 = Payment(friendship_id=9, amount=100.00)
    payment10 = Payment(friendship_id=10, amount=50.00)

    #justin payments
    payment11 = Payment(friendship_id=11, amount=75.00)
    payment12 = Payment(friendship_id=12, amount=100.00)
    payment13 = Payment(friendship_id=13, amount=50.00)
    payment14 = Payment(friendship_id=14, amount=75.00)
    payment15 = Payment(friendship_id=15, amount=100.00)

    #dmytro payments
    payment16 = Payment(friendship_id=16, amount=50.00)
    payment17 = Payment(friendship_id=17, amount=75.00)
    payment18 = Payment(friendship_id=18, amount=100.00)
    payment19 = Payment(friendship_id=19, amount=50.00)
    payment20 = Payment(friendship_id=20, amount=75.00)

    #will payments
    payment21 = Payment(friendship_id=21, amount=100.00)
    payment22 = Payment(friendship_id=22, amount=50.00)
    payment23 = Payment(friendship_id=23, amount=75.00)
    payment24 = Payment(friendship_id=24, amount=100.00)
    payment25 = Payment(friendship_id=25, amount=50.00)

    #anthony payments
    payment26 = Payment(friendship_id=26, amount=75.00)
    payment27 = Payment(friendship_id=27, amount=100.00)
    payment28 = Payment(friendship_id=28, amount=50.00)
    payment29 = Payment(friendship_id=29, amount=75.00)
    payment30 = Payment(friendship_id=30, amount=100.00)

    db.session.add_all([
        payment1, payment2, payment3, payment4, payment5,
        payment6, payment7, payment8, payment9, payment10,
        payment11, payment12, payment13, payment14, payment15,
        payment16, payment17, payment18, payment19, payment20,
        payment21, payment22, payment23, payment24, payment25,
        payment26, payment27, payment28, payment29, payment30
    ])
    db.session.commit()


def undo_payments():
    if environment == "production":
        db.session.execute(f"TRUNCATE TABLE {SCHEMA}.payments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM payments")

    db.session.commit()
