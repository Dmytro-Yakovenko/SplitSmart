from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
from flask_login import current_user


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('Email provided is not a SplitSmart user.')

def not_self(form, field):
    email = field.data
    if email == current_user.email:
        raise ValidationError('Cannot provide your own email.')


class FriendForm(FlaskForm):
    email = StringField("email", validators=[DataRequired(message='Email is required.'), Email(message='Not a valid email address.'), not_self, user_exists])
