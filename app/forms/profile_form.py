from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from flask_login import current_user
from wtforms import StringField, BooleanField
from wtforms.validators import DataRequired, Optional, Email, Regexp, Length, ValidationError
from app.models import User
from app.api.aws_helpers import ALLOWED_EXTENSIONS


def password_matches(form, field):
    # Checking if password matches
    password = field.data
    id = current_user.id
    user = User.query.filter(User.id == id).first()
    if not user.check_password(password):
        raise ValidationError('Password was incorrect.')


class ProfileForm(FlaskForm):
    first_name = StringField('first_name', validators=[DataRequired(message='First name is required.')])
    last_name = StringField('last_name', validators=[DataRequired(message='Last name is required.')])
    image_url = FileField('image_url', validators=[Optional(), FileAllowed(list(ALLOWED_EXTENSIONS))])
    is_changed = BooleanField('is_changed')
    password = StringField('password', validators=[DataRequired(message='Password is required.'), password_matches])
