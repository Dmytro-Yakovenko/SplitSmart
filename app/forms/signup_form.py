from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, Regexp, Optional, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def phone_number_exists(form, field):
    # Checking if phone_number exists
    phone_number = field.data
    user = User.query.filter(User.phone_number == phone_number).first()
    if user:
        raise ValidationError('Phone number is already in use.')


class SignUpForm(FlaskForm):
    first_name = StringField('first_name', validators=[DataRequired(message='First name is required.')])
    last_name = StringField('last_name', validators=[DataRequired(message='Last name is required.')])
    email = StringField('email', validators=[DataRequired(message='Email is required.'), Email(message='Not a valid email address.'), user_exists])
    phone_number = StringField('phone_number', validators=[Optional(), Regexp('^[0-9]{10}$', message='Please enter phone number in ########## format.'), phone_number_exists])
    image_url = StringField('image_url', validators=[Optional(), Regexp('[^\\s]+(.*?)\\.(jpg|jpeg|png)$', message='Image URL must end in .png, .jpg, or .jpeg')])
    password = StringField('password', validators=[DataRequired(message='Password is required.')])
