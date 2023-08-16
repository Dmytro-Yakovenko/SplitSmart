from app.models import db, Friendship, environment, SCHEMA
from sqlalchemy.sql import text

# User IDs
demo_id = 1
aurora_id = 2
justin_id = 3
dmytro_id = 4
will_id = 5
anthony_id = 6

def seed_friendships():

    # Friendships between demo and other users
    friendship1 = Friendship(user_id=demo_id, friend_id=aurora_id, bill=-150)
    friendship2 = Friendship(user_id=demo_id, friend_id=justin_id, bill=-120)
    friendship3 = Friendship(user_id=demo_id, friend_id=dmytro_id, bill=-25)
    friendship4 = Friendship(user_id=demo_id, friend_id=will_id, bill=30)
    friendship5 = Friendship(user_id=demo_id, friend_id=anthony_id)

    # Friendships between aurora and other users
    friendship6 = Friendship(user_id=aurora_id, friend_id=demo_id, bill=150)
    friendship7 = Friendship(user_id=aurora_id, friend_id=justin_id)
    friendship8 = Friendship(user_id=aurora_id, friend_id=dmytro_id)
    friendship9 = Friendship(user_id=aurora_id, friend_id=will_id)
    friendship10 = Friendship(user_id=aurora_id, friend_id=anthony_id)

    # Friendships between justin and other users
    friendship11 = Friendship(user_id=justin_id, friend_id=demo_id, bill=120)
    friendship12 = Friendship(user_id=justin_id, friend_id=aurora_id)
    friendship13 = Friendship(user_id=justin_id, friend_id=dmytro_id)
    friendship14 = Friendship(user_id=justin_id, friend_id=will_id, bill=30)
    friendship15 = Friendship(user_id=justin_id, friend_id=anthony_id)

    # Friendships between dmytro and other users
    friendship16 = Friendship(user_id=dmytro_id, friend_id=demo_id, bill=25)
    friendship17 = Friendship(user_id=dmytro_id, friend_id=aurora_id)
    friendship18 = Friendship(user_id=dmytro_id, friend_id=justin_id)
    friendship19 = Friendship(user_id=dmytro_id, friend_id=will_id)
    friendship20 = Friendship(user_id=dmytro_id, friend_id=anthony_id, bill=10)

    # Friendships between will and other users
    friendship21 = Friendship(user_id=will_id, friend_id=demo_id, bill=-30)
    friendship22 = Friendship(user_id=will_id, friend_id=aurora_id)
    friendship23 = Friendship(user_id=will_id, friend_id=justin_id, bill=-30)
    friendship24 = Friendship(user_id=will_id, friend_id=dmytro_id)
    friendship25 = Friendship(user_id=will_id, friend_id=anthony_id, bill=-30)

    # Friendships between anthony and other users
    friendship26 = Friendship(user_id=anthony_id, friend_id=demo_id)
    friendship27 = Friendship(user_id=anthony_id, friend_id=aurora_id)
    friendship28 = Friendship(user_id=anthony_id, friend_id=justin_id)
    friendship29 = Friendship(user_id=anthony_id, friend_id=dmytro_id, bill=-10)
    friendship30 = Friendship(user_id=anthony_id, friend_id=will_id, bill=30)

    db.session.add_all([
        friendship1, friendship2, friendship3, friendship4, friendship5,
        friendship6, friendship7, friendship8, friendship9, friendship10,
        friendship11, friendship12, friendship13, friendship14, friendship15,
        friendship16, friendship17, friendship18, friendship19, friendship20,
        friendship21, friendship22, friendship23, friendship24, friendship25,
        friendship26, friendship27, friendship28, friendship29, friendship30
    ])
    db.session.commit()


def undo_friendships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.friendships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friendships"))

    db.session.commit()
